# -*- coding: utf-8 -*-
import numpy as np
import matplotlib.pyplot as plt
import os


current_dir = os.path.dirname(os.path.abspath(__file__))
OUTPUT_FOLDER = os.path.join(current_dir, "results")
SCANS_FOLDER = os.path.join(current_dir, "uploads")


def reset_input_and_output_folders():
    for file in os.listdir(SCANS_FOLDER):
        os.remove(os.path.join(SCANS_FOLDER, file))

    for file in os.listdir(OUTPUT_FOLDER):
        os.remove(os.path.join(OUTPUT_FOLDER, file))


def generate_distribution(length):
    """
    Generate a distribution smoothly ranging from 0 to 100.

    Parameters:
        length (int): The number of points in the distribution.

    Returns:
        numpy.ndarray: A 1D array representing the distribution.
    """
    x = np.linspace(
        -6, 6, length
    )  # Generate evenly spaced values for smooth transitions
    distribution = 1 / (1 + np.exp(-x))  # Apply sigmoid function scaled to 0-100
    # reverse the distribution to start from 0 and end at 100
    distribution = 1 - distribution
    return np.array([distribution])


def spiral_plot(last, scans, confidence):
    """
    Generates a spiral plot to visualize coverage and overlaps of sequences.

    Parameters:
        seq_len (int): Length of the sequence.
        scans (int): Number of scans (1-3).
        confidence (numpy.ndarray): Confidence values for each scan (shape: [scans, seq_len]).
    """

    # Normalize confidence to ensure valid range [0, 1]
    confidence = np.clip(confidence, 0, 1)

    # Decompose `confidence` into the variables expected by the plotting function
    array1 = [confidence[i].reshape(1, -1) for i in range(scans)]
    col1 = [
        np.vstack([array1[i]] * 3) for i in range(scans)
    ]  # Simulate 3-row structure
    con = [[] for _ in range(scans)]
    con2 = np.zeros((scans, last))

    # Reset the environment by removing all the files in the output folder.
    for filename in os.listdir(OUTPUT_FOLDER):
        file_path = os.path.join(OUTPUT_FOLDER, filename)
        try:
            if os.path.isfile(file_path):
                os.remove(file_path)
                print(f"{filename} has been removed.")
        except Exception as e:
            print(e)

    name1, name2, name3 = None, None, None

    for index, filepath in enumerate(os.listdir(SCANS_FOLDER)):
        if index == 0:
            name1 = filepath.replace(".png", "").replace(".jpg", "")
        elif index == 1:
            name2 = filepath.replace(".png", "").replace(".jpg", "")
        elif index == 2:
            name3 = filepath.replace(".png", "").replace(".jpg", "")
        else:
            break

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

        # Ensure no NaN in `con3` for transparency
        con3 = np.nan_to_num(con3, nan=0.05)

        # %% ======== VISUALISE RESULTS ==================================================

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


if __name__ == "__main__":

    confidence = np.random.rand(3, 4_286)
    confidence[:, :1_000] = 0  # Set the first `zero_length` values to 0

    confidence = generate_distribution(4_286)
    confidence[:, :1_000] = 0  # Set the first `zero_length` values to 0
    spiral_plot(last=4286, scans=1, confidence=confidence)
