# -*- coding: utf-8 -*-
import cv2
import numpy as np
import matplotlib.pyplot as plt
from tqdm import tqdm
import os
from wiz_app_backend.mqtt_adapter import MQTTAdapter


current_dir = os.path.dirname(os.path.abspath(__file__))
OUTPUT_FOLDER = os.path.join(current_dir, "results")
SCANS_FOLDER = os.path.join(current_dir, "uploads")


def reset_input_and_output_folders():
    for file in os.listdir(SCANS_FOLDER):
        os.remove(os.path.join(SCANS_FOLDER, file))

    for file in os.listdir(OUTPUT_FOLDER):
        os.remove(os.path.join(OUTPUT_FOLDER, file))


def main(last: int, scans: int, message_bus: MQTTAdapter):
    """This is the sequence matching algorithms

    Parameters
    ----------
    last : int
        the sequence length of the scan
    scans : int
        the number of scans selected which can be from 1 - 3 (these should be kept on the uploads folder)
    message_bus : MQTTAdapter
        the mqtt client instance communicating to the frontend.

    Results
    -------
    png
        1 or more png files uploaded on the results folder showing the coverage.
    """

    # Connect to the message bus
    message_bus.connect()

    # Reset the environment by removing all the files in the output folder.
    for filename in os.listdir(OUTPUT_FOLDER):
        file_path = os.path.join(OUTPUT_FOLDER, filename)
        try:
            if os.path.isfile(file_path):
                os.remove(file_path)
                print(f"{filename} has been removed.")
        except Exception as e:
            print(e)

    # Get the file names of the scans
    filename1, filename2, filename3 = None, None, None
    name1, name2, name3 = None, None, None

    for index, filepath in enumerate(os.listdir(SCANS_FOLDER)):
        if index == 0:
            filename1 = os.path.join(SCANS_FOLDER, filepath)
            name1 = filepath.replace(".png", "").replace(".jpg", "")
        elif index == 1:
            filename2 = os.path.join(SCANS_FOLDER, filepath)
            name2 = filepath.replace(".png", "").replace(".jpg", "")
        elif index == 2:
            filename3 = os.path.join(SCANS_FOLDER, filepath)
            name3 = filepath.replace(".png", "").replace(".jpg", "")
        else:
            break

    # Reset the tasks completed global variable.
    number_of_tasks_completed = -1

    # %% ======== READ DATA AND CONVERT TO GREYSCALE ===============================

    l100 = [[] for _ in range(scans)]
    array1 = [[] for _ in range(scans)]
    col1 = [[] for _ in range(scans)]
    col3 = [[] for _ in range(scans)]
    con = [[] for _ in range(scans)]
    con2 = np.zeros((scans, last))

    for k in range(0, scans):
        print(k)
        if k == 0:
            A2 = cv2.imread(filename1)
        elif k == 1:
            A2 = cv2.imread(filename2)
        else:
            A2 = cv2.imread(filename3)

        # %% ======== AUTO CROP ======================================================
        A = A2.astype(np.float64) / 255.0  # Convert to double
        a2 = np.sum(A, axis=2)

        rows, cols = a2.shape

        c1 = np.zeros(rows)

        for i in range(rows - 26):
            c1[i + 13] = np.sum(a2[i : i + 25, :]) / 3 / cols / 25

        white = np.where(c1 == 1)[0]
        top = white[white < (rows // 2)]
        top = top[top < 700]  #!!! this restricts that white space only detected in
        # top part of the page
        bottom = white[white >= (rows // 2)]
        bottom = bottom[bottom > rows * 0.75]  #!!! this restricts that the white space
        # is only detected in the bottom 25%
        # maybe too strict
        top2 = top.max() if top.size > 0 else None
        bottom2 = bottom.min() if bottom.size > 0 else None

        A = A2[top2:bottom2, :, :]
        # large crop TOP

        # %% ======== SORT INTO ROW POSITIONS ========================================

        C1 = cv2.normalize(
            A[:, :, 2].astype("float"), None, 0.0, 1.0, cv2.NORM_MINMAX
        )  # Convert to normalized floating point
        C2 = cv2.normalize(
            A[:, :, 1].astype("float"), None, 0.0, 1.0, cv2.NORM_MINMAX
        )  # Convert to normalized floating point
        C3 = cv2.normalize(
            A[:, :, 0].astype("float"), None, 0.0, 1.0, cv2.NORM_MINMAX
        )  # Convert to normalized floating point

        C4 = (C1 + C2 + C3) / 3
        # turn to grey scale matrix

        # --- PATCHED: binarize, erode, update mask ---
        C5_bin = (C4 > 0.95).astype(np.uint8)
        # Use a slightly larger kernel to handle 2-pixel-thick dashes
        kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (2, 3))
        C5 = cv2.erode(C5_bin, kernel, iterations=1).astype(float)

        # Updated mask for 2-pixel-thick dashes
        mask = np.array(
            [
                [1, 1, 1, 1, 1, 1, 1, 1],
                [1, 0, 0, 0, 0, 0, 0, 1],
                [1, 0, 0, 0, 0, 0, 0, 1],
                [1, 1, 1, 1, 1, 1, 1, 1],
            ],
            dtype=float,
        )
        # --- END PATCH ---

        C5y = C5.shape[0]
        C5x = C5.shape[1]
        # Adjust t shape for new mask size
        t = np.zeros((C5y - mask.shape[0] + 1, C5x - mask.shape[1] + 1))

        # move to the next active task
        number_of_tasks_completed += 1

        for i in tqdm(range(0, C5x - mask.shape[1] + 1)):

            # publish the telemetry
            message_bus.publish_data(
                "sequence_matching_progress/1", {"current": i, "total": C5x - 6}
            )
            message_bus.publish_data(
                "sequence_matching_progress/tasks_completed",
                {"tasks completed": number_of_tasks_completed},
            )

            for j in range(0, C5y - mask.shape[0] + 1):

                t[j, i] = abs(
                    C5[j : j + mask.shape[0], i : i + mask.shape[1]] - mask
                ).sum()

        t2 = abs(t)
        t2[(t2 > 0)] = 1

        t3 = t2.sum(axis=1)

        # --- PATCHED: border/gaps/cut logic ---
        val = np.argwhere(t3 < C5x - mask.shape[1] + 1)
        border = val + 1
        gaps = np.diff(border[:, 0]) if border.shape[0] > 1 else np.array([])
        # Only cut at the first large gap (to ignore extra sequence blocks)
        if gaps.size > 0:
            cut = np.where(gaps > (gaps.mean() * 2))[0]
        else:
            cut = np.array([], dtype=int)
        if cut.size:
            border = border[: cut[0] + 1]
        # --- END PATCH ---

        # --- robust column-width estimation -------------------------------------------
        # Ensure l3 is always defined before use
        l1 = []
        l3 = []
        l5 = []
        l6 = []
        l7 = []

        scal1_candidates = np.diff(np.argwhere(t2.sum(axis=0) < t2.shape[0]), axis=0)

        if scal1_candidates.size == 0:
            # no visible gaps → fall back to coloured-bar lengths (l3) or 22 px default
            scal2 = np.median(l3) if len(l3) else 22.0
        else:
            mean_val = scal1_candidates.mean()
            scal1 = scal1_candidates[scal1_candidates > mean_val]
            scal2 = scal1.max() if scal1.size else np.median(l3) if len(l3) else 22.0
        # -------------------------------------------------------------------------------

        scal3 = np.diff(np.argwhere(t2.sum(axis=1) < t2.shape[1]), axis=0)

        # Defensive: handle empty border for concatenation
        border2 = (
            np.around((np.diff((border), axis=0) - 42) / 22)
            if border.shape[0] > 1
            else np.array([])
        )
        border2 = np.append(border2, [0])
        # Only concatenate if border and border2 shapes match
        if border.shape[0] == border2.shape[0]:
            border = np.transpose(
                np.concatenate(
                    [border, np.reshape(border2, (border2.shape[0], -1))], axis=1
                )
            )
        else:
            # fallback: just use border as is (skip concatenation)
            border = border.T if border.ndim == 2 else border

        #!!!!! need to join border and border2 together into new border 2 row variable !!!!

        # %% ======== START SEARCH LOOP ================================================

        found_bar = 0
        pixel_check = 10
        new = 1

        # move to the next active task
        number_of_tasks_completed += 1

        for i in tqdm(range(0, C1.shape[0])):

            message_bus.publish_data(
                "sequence_matching_progress/2", {"current": i, "total": C1.shape[0]}
            )
            message_bus.publish_data(
                "sequence_matching_progress/tasks_completed",
                {"tasks completed": number_of_tasks_completed},
            )

            for j in range(0, C1.shape[1] - 10):

                if C1[i, j : j + 11].mean() < 0.05 and C1[i, j - 1] < 0.4 and new == 1:
                    l1.append([i + 2, j])
                    l5.append(C1[i + 2, j + 2])
                    l6.append(C2[i + 2, j + 2])
                    l7.append(C3[i + 2, j + 2])
                    new = 0

                elif (
                    C1[i, j : j + 11].mean() < 0.05 and C1[i, j - 1] < 0.4 and new == 0
                ):
                    pixel_check = pixel_check + 1

                elif (
                    C1[i, j : j + 11].mean() >= 0.05
                    and C1[i, j - 1] >= 0.4
                    and new == 0
                ):
                    l3.append(pixel_check)
                    pixel_check = 11
                    new = 1
                    found_bar = found_bar + 1

        l2 = np.array(l1)
        l4 = np.around(np.array(l3) / scal2)
        l = np.concatenate(
            ([l2[:, 0]], [l2[:, 1]], [l3], [l4], [l5], [l6], [l7]), axis=0
        ).transpose()

        # %% ======== REMOVE SEARCHES THAT ARE WHITE, LEAVING ONLY COLOURS =============

        for i in range(0, l4.shape[0]):

            if l[i, 4:7].sum() == 3:
                l[i, :] = np.nan

        l = l[~np.isnan(l).any(axis=1)]

        # %% ======== POSITION BARS IN FROM THE TOP ====================================

        l8 = []
        l8.append(0)

        for i in range(1, l.shape[0]):
            if (
                l[i, 0] - l[i - 1, 0] > 30
                or l[i, 0] - l[i - 1, 0] == 0
                and l8[i - 1] == 0
            ):
                l8.append(0)
            else:

                if l[i, 0] - l[i - 1, 0] == 0:

                    l8.append(l8[i - 1])
                else:
                    l8.append(l8[i - 1] + 1)

        l = np.concatenate([l, np.array(l8).reshape(l.shape[0], 1)], axis=1)

        # %% ======== CREATE INDEX FOR EACH BAR IN TERMS OF SEQUENCE POSITION RATHER THAN PIXELS

        index = []
        for i in range(0, l.shape[0]):
            temp = border[0, :] - l[i, 0]
            temp[(temp > 0)] = np.nan
            # Defensive: skip if all values are nan or temp is empty
            if np.all(np.isnan(temp)) or temp.size == 0:
                index.append(0)
            else:
                c, ind = np.nanmax(temp), np.nanargmax(temp)
                index.append(ind + 1)

        index = np.array(index)
        l9 = (index - 1) * 50 + 1
        l10 = np.around(l[:, 1] / scal2)
        l11 = l9 + l10
        l12 = l[:, 3]
        l13 = l11 + l12 - 1

        l = np.concatenate(
            [
                l,
                l9.reshape(l.shape[0], 1),
                l10.reshape(l.shape[0], 1),
                l11.reshape(l.shape[0], 1),
                l12.reshape(l.shape[0], 1),
                l13.reshape(l.shape[0], 1),
            ],
            axis=1,
        )

        # %% ======== BAR MATCHING =====================================================

        l14 = []
        for i in range(0, l.shape[0]):
            st1 = int(l[i, 0] + 5) - 2
            st2 = int(l[i, 1] + l[i, 2] - 1) - 0
            l14.append(
                (C1[st1, st2] * 3 + C2[st1, st2] * 5 + C3[st1, st2] * 7) / 105
            )  ## line 208 in MATLAB code
        l14 = np.array(l14)

        l15 = []
        for i in range(0, l.shape[0]):
            st1 = int(l[i, 0] + 5) - 2
            st2 = int(l[i, 1] - 1) - 0
            l15.append(
                (C1[st1, st2] * 3 + C2[st1, st2] * 5 + C3[st1, st2] * 7) / 105
            )  ## line 208 in MATLAB code
        l15 = np.array(l15)

        l = np.concatenate(
            [l, l14.reshape(l.shape[0], 1), l15.reshape(l.shape[0], 1)], axis=1
        )

        # !!!!!!!!!!! need to add to l variable !!!!!!!!!!!!!!!!!!

        # %% ======== JOIN BARS BACK TOGETHER ==========================================

        for i in range(l.shape[0], 0, -1):

            if l[i - 1, 12] % 50 == 0:

                if sum(l[i - 1 :, 10] == l[i - 1, 12] + 1) > 0 and l[i - 1, 13] != 0:

                    check = l[i - 1, 13]

                    place = np.where(l[i - 1 :, 14] == check)[0]

                    place2 = [
                        x for x in place if x < l[i - 1, 12]
                    ]  # works most of the time

                    l[i - 1, 11] = l[i - 1, 11] + l[i + place2[-1] - 1, 11]
                    l[i - 1, 12] = l[i + place2[-1] - 1, 12]

                    l[i + place2[-1] - 1, :] = np.nan

        l = l[~np.isnan(l).any(axis=1)]

        # %% ======== CREATE SINGLE ARRAY ==============================================

        array1[k] = np.zeros((int(np.nanmax(l[:, 7]) + 1), last))
        col1[k] = np.zeros((int(np.nanmax(l[:, 7]) + 1) * 3, last))

        for i in range(0, l.shape[0]):

            array2 = array1[k][int(l[i, 7]), int(l[i, 10]) - 1 : int(l[i, 12])]
            array2 = np.ones_like(array2)
            array1[k][int(l[i, 7]), int(l[i, 10]) - 1 : int(l[i, 12])] = array2 * (
                l[i, 7] + 1
            )

            col2 = col1[k][
                (int(l[i, 7]) + 1) * 3 - 3 : (int(l[i, 7]) + 1) * 3,
                int(l[i, 10]) - 1 : int(l[i, 12]),
            ]
            col2 = np.ones_like(col2)
            col1[k][
                (int(l[i, 7]) + 1) * 3 - 3 : (int(l[i, 7]) + 1) * 3,
                int(l[i, 10]) - 1 : int(l[i, 12]),
            ] = ((l[i, 4:7]).reshape(3, 1)) * col2

        # Calculate the number of ones rows to be added
        num_ones_rows = (col1[k].shape[0] + 2) // 3

        # Create a new array with extra rows
        new_shape = (col1[k].shape[0] + num_ones_rows, col1[k].shape[1])
        new_array = np.zeros(new_shape, dtype=col1[k].dtype)

        # Fill the new array with the original data and rows of ones
        for i in range(new_shape[0]):
            if (
                i % 4 == 3
            ):  # Add a row of ones every 4th row (i.e., after every 3 original rows)
                new_array[i] = 1
            else:
                new_array[i] = col1[k][i - i // 4]

        # new_array is the array with added rows of ones

        col3[k] = new_array

        l100[k] = l

    # %% ======== BUILD COLOR MATRIX ===================================================
    if scans > 1:
        mo = 1
    else:
        mo = 0

    for k2 in range(0, scans + mo):

        if k2 < scans:
            a1 = np.zeros((1, last))
            a1[0 : array1[0].shape[1] - 1] = np.nansum(array1[k2], axis=0)
            a1[(a1 > 0)] = 1
            a1 = a1.flatten()
            colorID = np.empty_like(a1, dtype=object)
            colorID[a1 == 0] = "#333333"  # DARK GREY
            if k2 == 0:
                colorID[a1 == 1] = "#3955A5"  # BLUE
            elif k2 == 1:
                colorID[a1 == 1] = "#F5BA16"  # YELLOW
            elif k2 == 2:
                colorID[a1 == 1] = "#1EAC4B"  # GREEN

        else:
            a1co = np.zeros((scans, last))
            for k3 in range(0, scans):

                a1 = np.zeros((1, last))
                a1[0 : array1[0].shape[1] - 1] = np.nansum(array1[k3], axis=0)
                a1[(a1 > 0)] = 2**k3
                a1co[k3, :] = a1.flatten()

                a2co = np.sum(a1co, axis=0)

            colorID = np.empty_like(a2co, dtype=object)

            if scans == 2:
                colorID[a2co == 0] = "#333333"  # DARK GREY
                colorID[a2co == 1] = "#3955A5"  # BLUE
                colorID[a2co == 2] = "#F5BA16"  # YELLOW
                colorID[a2co == 3] = "#9E1C20"  # RED

            if scans == 3:
                colorID[a2co == 0] = "#333333"  # DARK GREY
                colorID[a2co == 1] = "#3955A5"  # BLUE
                colorID[a2co == 2] = "#F5BA16"  # YELLOW
                colorID[a2co == 4] = "#1EAC4B"  # GREEN
                colorID[a2co == 7] = "#9E1C20"  # RED
                colorID[np.isin(a2co, [3, 5, 6])] = "#9E1C20"  # RED (all combos of 2)

        # %% ======== ASSIGN NUMERICAL CONFIDENCE VALUES TO COLORED BARS ==================

        if k2 < scans:

            con[k2] = np.zeros((col1[k2].shape[0] // 3, last))

            for i in range(0, col1[k2].shape[0], 3):
                for j in range(0, col1[k2].shape[1]):

                    if (
                        round(
                            np.sum(col1[k2][i : i + 3, j] * np.array([3, 5, 7])) * 10000
                        )
                        == 90235
                    ):
                        con[k2][int((i + 3) / 3 - 1), j] = 0.75
                    elif (
                        round(
                            np.sum(col1[k2][i : i + 3, j] * np.array([3, 5, 7])) * 10000
                        )
                        == 102784
                    ):
                        con[k2][int((i + 3) / 3 - 1), j] = 0.35
                    elif (
                        round(
                            np.sum(col1[k2][i : i + 3, j] * np.array([3, 5, 7])) * 10000
                        )
                        == 115137
                    ):
                        con[k2][int((i + 3) / 3 - 1), j] = 0.15
                    elif (
                        round(
                            np.sum(col1[k2][i : i + 3, j] * np.array([3, 5, 7])) * 10000
                        )
                        == 100196
                    ):
                        con[k2][int((i + 3) / 3 - 1), j] = 0.075
                    elif (
                        round(
                            np.sum(col1[k2][i : i + 3, j] * np.array([3, 5, 7])) * 10000
                        )
                        == 135059
                    ):
                        con[k2][int((i + 3) / 3 - 1), j] = 0.035
                    elif (
                        round(
                            np.sum(col1[k2][i : i + 3, j] * np.array([3, 5, 7])) * 10000
                        )
                        == 116431
                    ):
                        con[k2][int((i + 3) / 3 - 1), j] = 0.015
                    elif (
                        round(
                            np.sum(col1[k2][i : i + 3, j] * np.array([3, 5, 7])) * 10000
                        )
                        == 94118
                    ):
                        con[k2][int((i + 3) / 3 - 1), j] = 0.0075
                    elif (
                        round(
                            np.sum(col1[k2][i : i + 3, j] * np.array([3, 5, 7])) * 10000
                        )
                        == 112941
                    ):
                        con[k2][int((i + 3) / 3 - 1), j] = 0.0035
                    elif (
                        round(
                            np.sum(col1[k2][i : i + 3, j] * np.array([3, 5, 7])) * 10000
                        )
                        == 132000
                    ):
                        con[k2][int((i + 3) / 3 - 1), j] = 0.0015
                    elif (
                        round(
                            np.sum(col1[k2][i : i + 3, j] * np.array([3, 5, 7])) * 10000
                        )
                        == 150000
                    ):
                        con[k2][int((i + 3) / 3 - 1), j] = 0.0005

            con2[k2, :] = con[k2].sum(axis=0)
            con3 = con2[k2, :] / np.max(con2[k2, :])

        if k2 == scans:
            con3 = np.sum(con2, axis=0)

        con3 = con3 / np.max(con3)

        # %% ======== VISUALISE RESULTS ==================================================

        message_bus.publish_data(
            "sequence_matching_progress/plot", {"step": "spiral_plot"}
        )

        plt.figure(figsize=(6, 8))

        t = np.linspace(10 * np.pi, (last * 0.01 + 10) * np.pi, last)
        con4 = (con3 * 100) + 10
        con5 = (con3 + 1) / np.max(con3 + 1)

        def get_closest_snap(last):
            def closest_num(n, lst):
                return lst[min(range(len(lst)), key=lambda i: abs(lst[i] - n))]

            last /= 8

            # Create the list
            lst = [1, 2, 5]
            i = 0
            while lst[-1] < last:
                lst += [10**i, 2 * 10**i, 5 * 10**i]
                i += 1

            return closest_num(last, lst)

        # Test the function
        div = get_closest_snap(last)

        for i in range(0, 200, 20):
            print(i)

            sstart = i
            send = i + ((last // 200) * 200)
            if send > last:
                send = send - 200
            sinner = 1.0
            souter = 1.05
            plt.plot(
                [
                    t[sstart] * np.cos(t[sstart]) * sinner,
                    t[send] * np.cos(t[send]) * souter,
                ],
                [
                    t[sstart] * np.sin(t[sstart]) * sinner,
                    t[send] * np.sin(t[send]) * souter,
                ],
                color=[0.8, 0.8, 0.8],
                linewidth=1,
                zorder=1,
            )
            print("Start: ", sstart)
            print("End: ", send)
            print(
                [
                    t[sstart] * np.cos(t[sstart]) * sinner,
                    t[send] * np.cos(t[send]) * souter,
                ]
            )
            print(
                [
                    t[sstart] * np.sin(t[sstart]) * sinner,
                    t[send] * np.sin(t[send]) * souter,
                ]
            )
            if sstart > 0 and sstart < 100:
                plt.text(
                    t[send] * np.cos(t[send]) * souter * 1.05,
                    t[send] * np.sin(t[send]) * souter * 1.05,
                    str(i),
                    ha="center",
                    va="center",
                    fontsize=8,
                    color="0.3",
                )
            elif sstart > 100 and sstart < 200:
                plt.text(
                    t[send] * np.cos(t[send]) * souter * 1.05,
                    t[send] * np.sin(t[send]) * souter * 1.05,
                    str(i - 100),
                    ha="center",
                    va="center",
                    fontsize=8,
                    color="0.3",
                )

        for i in range(0, last):
            plt.scatter(
                t[i] * np.cos(t[i]),
                t[i] * np.sin(t[i]),
                s=con4[i] * (i / (last / 2) * 0.5 + 0.5),
                c=colorID[i],
                alpha=con5[i],
                edgecolors="none",
            )

        plt.scatter(
            t[0] * np.cos(t[0]),
            t[0] * np.sin(t[0]),
            s=60,
            c="#222222",
            alpha=1,
            marker="o",
        )
        plt.text(
            t[0] * np.cos(t[0]),
            t[0] * np.sin(t[0]) + 3,
            "Start",
            fontweight="bold",
            color="#222222",
            rotation=60,
        )

        for i in range(div, int((last // div) * div) + 1, div):

            plt.scatter(
                t[i] * np.cos(t[i]),
                t[i] * np.sin(t[i]),
                s=60,
                c="#222222",
                alpha=1,
                marker="o",
            )
            if t[0] * np.cos(t[i]) > 0:
                plt.text(
                    t[i] * np.cos(t[i]),
                    t[i] * np.sin(t[i]) + 3,
                    str(i),
                    fontweight="bold",
                    color="#222222",
                    rotation=60,
                )
            else:
                plt.text(
                    t[i] * np.cos(t[i]),
                    t[i] * np.sin(t[i]) - 11,
                    str(i),
                    fontweight="bold",
                    color="#222222",
                    ha="right",
                    rotation=60,
                )

        plt.scatter(
            t[-1] * np.cos(t[-1]),
            t[-1] * np.sin(t[-1]),
            s=60,
            color="#222222",
            alpha=1,
            marker="o",
        )
        plt.text(
            t[-1] * np.cos(t[-1]),
            t[-1] * np.sin(t[-1]) + 3,
            f"End ({last})",
            fontweight="bold",
            color="#222222",
            ha="left",
            rotation=60,
        )

        plt.axis("off")
        plt.axis("equal")
        plt.tight_layout()
        m = np.sqrt((t[-1] * np.cos(t[-1])) ** 2 + (t[-1] * np.sin(t[-1])) ** 2) * 1.1
        plt.ylim([-1.5 * m, m])

        box = {
            "facecolor": "#999999",
            "edgecolor": "none",
            "linewidth": 0,
            "boxstyle": "round",
        }
        plt.text(0, -m * 1.1 - 0, "No coverage", ha="center", va="center", bbox=box)

        if k2 < scans:

            if k2 == 0:
                box = {
                    "facecolor": "#3955A5",
                    "edgecolor": "none",
                    "linewidth": 0,
                    "boxstyle": "round",
                }
                plt.text(
                    0,
                    -m * 1.1 - m * 2 / 15 * 1,
                    f"{name1}: {round(len(a1[a1 > 0]) / last * 100)}%",
                    ha="center",
                    va="center",
                    color="white",
                    bbox=box,
                )
            elif k2 == 1:
                box = {
                    "facecolor": "#F5BA16",
                    "edgecolor": "none",
                    "linewidth": 0,
                    "boxstyle": "round",
                }
                plt.text(
                    0,
                    -m * 1.1 - m * 2 / 15 * 1,
                    f"{name2}: {round(len(a1[a1 > 0]) / last * 100)}%",
                    ha="center",
                    va="center",
                    bbox=box,
                )
            elif k2 == 2:
                box = {
                    "facecolor": "#1EAC4B",
                    "edgecolor": "none",
                    "linewidth": 0,
                    "boxstyle": "round",
                }
                plt.text(
                    0,
                    -m * 1.1 - m * 2 / 15 * 1,
                    f"{name3}: {round(len(a1[a1 > 0]) / last * 100)}%",
                    ha="center",
                    va="center",
                    bbox=box,
                )

        else:
            if scans == 2:
                box = {
                    "facecolor": "#3955A5",
                    "edgecolor": "none",
                    "linewidth": 0,
                    "boxstyle": "round",
                }
                plt.text(
                    0,
                    -m * 1.1 - m * 2 / 15 * 1,
                    f"{name1}: {round(len(a1co[0][a1co[0] > 0]) / last * 100)}%",
                    ha="center",
                    va="center",
                    color="white",
                    bbox=box,
                )
                box = {
                    "facecolor": "#F5BA16",
                    "edgecolor": "none",
                    "linewidth": 0,
                    "boxstyle": "round",
                }
                plt.text(
                    0,
                    -m * 1.1 - m * 2 / 15 * 2,
                    f"{name2}: {round(len(a1co[1][a1co[1] > 0]) / last * 100)}%",
                    ha="center",
                    va="center",
                    bbox=box,
                )
                box = {
                    "facecolor": "#9E1C20",
                    "edgecolor": "none",
                    "linewidth": 0,
                    "boxstyle": "round",
                }
                plt.text(
                    0,
                    -m * 1.1 - m * 2 / 15 * 3,
                    f"Combined: {round(len(a2co[a2co > 0]) / last * 100)}%",
                    ha="center",
                    va="center",
                    color="white",
                    bbox=box,
                )

            elif scans == 3:
                box = {
                    "facecolor": "#3955A5",
                    "edgecolor": "none",
                    "linewidth": 0,
                    "boxstyle": "round",
                }
                plt.text(
                    0,
                    -m * 1.1 - m * 2 / 17 * 1,
                    f"{name1}: {round(len(a1co[0][a1co[0] > 0]) / last * 100)}%",
                    ha="center",
                    va="center",
                    color="white",
                    bbox=box,
                )
                box = {
                    "facecolor": "#F5BA16",
                    "edgecolor": "none",
                    "linewidth": 0,
                    "boxstyle": "round",
                }
                plt.text(
                    0,
                    -m * 1.1 - m * 2 / 17 * 2,
                    f"{name2}: {round(len(a1co[1][a1co[1] > 0]) / last * 100)}%",
                    ha="center",
                    va="center",
                    bbox=box,
                )
                box = {
                    "facecolor": "#1EAC4B",
                    "edgecolor": "none",
                    "linewidth": 0,
                    "boxstyle": "round",
                }
                plt.text(
                    0,
                    -m * 1.1 - m * 2 / 17 * 3,
                    f"{name3}: {round(len(a1co[2][a1co[2] > 0]) / last * 100)}%",
                    ha="center",
                    va="center",
                    color="white",
                    bbox=box,
                )
                box = {
                    "facecolor": "#9E1C20",
                    "edgecolor": "none",
                    "linewidth": 0,
                    "boxstyle": "round",
                }
                plt.text(
                    0,
                    -m * 1.1 - m * 2 / 17 * 4,
                    f"Combined: {round(len(a2co[a2co > 0]) / last * 100)}%",
                    ha="center",
                    va="center",
                    color="white",
                    bbox=box,
                )

        plt.gca().invert_xaxis()

        plt.savefig(os.path.join(OUTPUT_FOLDER, f"plot{k2}.png"))

    # %% ======= LINEAR PLOTS ==============================================

    print("Creating linear plots...")
    message_bus.publish_data("sequence_matching_progress/plot", {"step": "linear_plot"})

    # New shape will be (17, 930, 3) to include the white rows
    extended_grid_data = np.ones(
        (col3[0].shape[0] // 4 * 2 + (col3[0].shape[0] // 4 - 1) + 4, last, 4)
    ) * [
        0.223,
        0.332,
        0.644,
        0.10,
    ]  # Initialize with white rows

    if scans > 1:
        more_data = np.ones(
            (col3[1].shape[0] // 4 * 2 + (col3[1].shape[0] // 4 - 1) + 4, last, 4)
        ) * [0.957, 0.727, 0.086, 0.10]

    if scans > 2:
        more_data2 = np.ones(
            (col3[2].shape[0] // 4 * 2 + (col3[2].shape[0] // 4 - 1) + 4, last, 4)
        ) * [0.118, 0.675, 0.294, 0.10]

    white_space = np.ones((5, last, 4)) * [1, 1, 1, 1]

    # Initialize an empty 4x930 matrix
    matrix = np.zeros((4, len(colorID)))

    # Loop through each hex code and intensity value
    for i in range(len(colorID)):
        # Convert hex to RGB
        hex_code = colorID[i]
        r = int(hex_code[1:3], 16) / 255.0
        g = int(hex_code[3:5], 16) / 255.0
        b = int(hex_code[5:7], 16) / 255.0

        # Fill the matrix with RGB and intensity values
        matrix[0, i] = r
        matrix[1, i] = g
        matrix[2, i] = b
        matrix[3, i] = con3[i] * 0.9 + 0.1

    matrix_transposed = matrix.T

    # Expand dimensions to make it 930x1x4
    matrix_expanded = np.expand_dims(matrix_transposed, axis=1)

    # Repeat the matrix 10 times along the new dimension
    result_matrix = np.repeat(matrix_expanded, 10, axis=1)

    # The shape of result_matrix will now be 930x10x4
    # To get it in the shape 10x930x4, we can simply transpose the last two dimensions
    result_matrix = result_matrix.transpose(1, 0, 2)

    # Vertically stack extended_grid_data and more_data
    if scans == 2:
        extended_grid_data = np.vstack(
            (extended_grid_data, more_data, white_space, result_matrix)
        )
    elif scans == 3:
        extended_grid_data = np.vstack(
            (extended_grid_data, more_data, more_data2, white_space, result_matrix)
        )
    else:
        extended_grid_data = np.vstack((extended_grid_data, white_space, result_matrix))

    # ---------- scan 1 ---------------------------------------------------
    data = col3[0]
    grid_data = np.zeros((data.shape[0] // 4, last, 4))

    # Process each set of three rows as one row in the grid
    for i in range(0, data.shape[0], 4):
        row_index = i // 4
        for j in range(last):
            # Here we take the three consecutive values as one RGB value
            rgb = data[i : i + 4, j]
            # If the RGB value is [0, 0, 0] (black), we change it to [1, 1, 1] (white)
            if np.all(rgb[0:3] == 0):
                rgb = np.array([0.223, 0.332, 0.644, 0.10])
            grid_data[row_index, j, :] = rgb

    # Copy the original grid data into the new extended grid, duplicating even rows
    for i in range(0, data.shape[0] // 4):
        i2 = i * 2 + i + 2
        extended_grid_data[i2] = grid_data[i]
        if i < data.shape[0] // 4:  # Avoid duplicating the last row
            extended_grid_data[i2 + 1] = grid_data[i]
            lastrec = i2 + 4

    # ---------- scan 2 ---------------------------------------------------
    if scans > 1:
        data = col3[1]
        grid_data = np.zeros((data.shape[0] // 4, last, 4))

        # Process each set of three rows as one row in the grid
        for i in range(0, data.shape[0], 4):
            row_index = i // 4
            for j in range(last):
                # Here we take the three consecutive values as one RGB value
                rgb = data[i : i + 4, j]
                # If the RGB value is [0, 0, 0] (black), we change it to [1, 1, 1] (white)
                if np.all(rgb[0:3] == 0):
                    rgb = np.array([0.957, 0.727, 0.086, 0.10])
                grid_data[row_index, j, :] = rgb

        # Copy the original grid data into the new extended grid, duplicating even rows
        for i in range(0, data.shape[0] // 4):
            i2 = i * 2 + i + 2
            extended_grid_data[i2 + lastrec] = grid_data[i]
            if i < data.shape[0] // 4:  # Avoid duplicating the last row
                extended_grid_data[i2 + 1 + lastrec] = grid_data[i]

    # ---------- scan 3 ---------------------------------------------------
    if scans > 2:
        data = col3[2]
        grid_data = np.zeros((data.shape[0] // 4, last, 4))

        # Process each set of three rows as one row in the grid
        for i in range(0, data.shape[0], 4):
            row_index = i // 4
            for j in range(last):
                # Here we take the three consecutive values as one RGB value
                rgb = data[i : i + 4, j]
                # If the RGB value is [0, 0, 0] (black), we change it to [1, 1, 1] (white)
                if np.all(rgb[0:3] == 0):
                    rgb = np.array([0.118, 0.675, 0.294, 0.10])
                grid_data[row_index, j, :] = rgb

        # Copy the original grid data into the new extended grid, duplicating even rows
        for i in range(0, data.shape[0] // 4):
            i2 = i * 2 + i + 2 + np.size(more_data, 0)
            print(i2)
            extended_grid_data[i2 + lastrec] = grid_data[i]
            if i < data.shape[0] // 4:  # Avoid duplicating the last row
                extended_grid_data[i2 + 1 + lastrec] = grid_data[i]

    # Plotting
    plt.figure(figsize=(18, 4))
    plt.imshow(
        extended_grid_data, aspect="auto", interpolation="nearest"
    )  # Disable interpolation

    # Adding labels for columns 1, 50, 100, ..., 900, and 930
    for j in range(div, int((last // div) * div) + 1, div):
        plt.text(j, -4, str(j), ha="center", va="center", fontsize=6, color="black")

    plt.axis("off")

    plt.savefig(os.path.join(OUTPUT_FOLDER, "linear_plot.png"))

    message_bus.publish_data("sequence_matching_progress/plot", {"step": "completed"})

    # send 100 messages to the frontend to let it know what the
    for i in range(100):
        message_bus.publish_data(
            "sequence_matching_progress/tasks_completed", {"tasks completed": "ALL"}
        )


if __name__ == "__main__":
    main(last=931, scans=2, message_bus=MQTTAdapter())
