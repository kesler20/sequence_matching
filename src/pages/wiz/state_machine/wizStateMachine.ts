import { createMachine, assign } from "xstate";

// Define a context to hold any data that needs to be shared across states.
interface Context {
  fileData: File | null;
}

// Define the shape of the events that the machine can handle.
type Events =
  | { type: "upload file clicked" }
  | { type: "file uploaded successfully"; file: File }
  | { type: "back to modify plot" }
  | { type: "file failed to upload" }
  | { type: "add a file" }
  | { type: "select x axis" }
  | { type: "select y axis" }
  | { type: "select plot type" }
  | { type: "select color" }
  | { type: "select z axis" }
  | { type: "select size" }
  | { type: "select surface plot" };

// Define the states that the machine can be in.
type State =
  | {
      value: "No files & No Axis selected";
      context: Context & { fileData: null };
    }
  | {
      value: "Upload a file";
      context: Context & { fileData: File };
    }
  | { value: "File & No axis selected"; context: Context }
  | { value: "One dimensional Plot"; context: Context }
  | { value: "Bar Chart"; context: Context }
  | { value: "2D PlotType Selected"; context: Context }
  | { value: "Violin Plot"; context: Context }
  | { value: "3D Scatter Plot"; context: Context }
  | { value: "Coloured Bar Chart"; context: Context }
  | { value: "Coloured 3D Scatter Plot"; context: Context }
  | { value: "5D Plot"; context: Context }
  | { value: "2D Coloured PlotType Selected"; context: Context }
  | { value: "Contour Plot"; context: Context }
  | { value: "Surface Plot"; context: Context }
  | { value: "new state 2"; context: Context };

const wizStateMachine = createMachine<Context, Events, State>({
  /** @xstate-layout N4IgpgJg5mDOIC5QAUA2B7ALgAgEIFcBLVCMAJwDoA5dbAM2LmwDJsbsBBAD0Nm1jCowAY0yQAxPgAOGAIYR6jbMNSFhAa0gBtAAwBdRKCnpYhTIXQA7QyC6IATAE4ArBUcB2RwEYAHM-fuzj7uAMwhADQgAJ4O9joU9u463vbOIe5eAGwALL4AvnmRaFh4RCTk1LQMQnys7Ny8-IIiYhDi8gqyikK6BkggxqbmVjZ2CO7Z7hSZwWlhyTqJ9pExCGHZFOnOOtlh6fZhjiEFRRg4BMSklACqMujy2F3VYOLP2NJypAqw+MLCcLA6PhUKgor0bIMzBZrP0xgcfBQdCEvIlfPYZs5Mo4VogQvYvAkkn4QtlsjptmkTiBiucylcKLdPo9ui8AEayDTYTC0AC26AghDoUWwd0w4P6kOGMNAcJCCKRKIyPnRfixOIQiXiAR0PmVjl1PhJ7ipNNKlwqjPunRZryUdFkjAU3Ped3k4qMJihI1hiFybkcAcDQYDPky6vxIUJOpRznsPi8oSOJrOZvKlAAYko6rRZDw+AIhKIJAWWtguI88+6Bp6paNEF4QjNppi8aHMu5De5w2FNoEddlHJl7KSfDrkyULmmKJmhCw2Dm801C61xCXRNhhbneFXJdC6wgG03Mi245l2531ete9tdmF3AcQknCtSU5P6TOwHP2Fv880i201xwAAvCtt30CEaz3H0D0bBFj0yVszw7dJL0cewKFmHQGw7HxHB2bJx1pc1KAAeUsT8BR5MBLFMKxZFQbAaVXP8cE3StwIlSDvRlet7wRZxcl1TUQh0AJu0cChPATbJ2x2R9kR8QjU3pMiKMIKiaOhejGLOZjlxFFNMCiKQwB3LjpVsXi4woATfGVJIRLE6J61whJvHbIddlCA5nCUt8KlwWQyGwABhAALILMD00tRS5YzTI4j0higniNXxVwh1jZxYyyZxvGcdVsmVCgsjPASdA82NMj8ukAqC0KIrIKLAOUdAMDIMzku4yy0q8DLUlSHLj3y9U7IoXIkKCDwE0NewauIihAuC8LIui9cQJ-TqvQsuF0umAbsvxYa+svJw3FK4IZLJbDqufU1-MoAA1CxVEsHSsDWnBy02xLqy6narP4wT7KRUSu2ctYyUk9zgkyMGSWOO7X1qp6XsIN6mJa77Ky8Poku2-cE2s2yhIcsHwzwtyE2pzEKvSeapxCAARbAAGVhFkTAxGCzGWNa9qttraDGwExFkVJESBw8XZTvQs8zzQuVghCASGfpEK2vQfAyEgPB6pWprPoMkojJMwWUp6uNDURIdO3SZU9nDRYEm2LCRNDFEVbVioNYwbXdaWhrVpajb2Lxv6Cegq3IwquN0nth8Igh+NxsDAI-H8I4xyRicUYoX2tZ1hRmbZjmufId7mr50wgIS8Pd26sYyRVmyhq8LDRORcHVmRVwJpmCrsljbxHG9yh7BZgv-YUGkABV4rZljiz50OwPr8z9z2eV8S8Oyh3JbuHGd4cAwQ6Nba9nOiKnDXLG5bXK6Nn4yHtf5jbFX6G4Bg8+Js4HhPJhDR86FMLYV1HhUkBRnyWH5HAGw90UYQX+vuAAtJkREOhMFYOwZgrw2R1RoLHpUFktR5ycEXIBSASDI6pVdoie8Rxgj4gOKES8JIMITADHsRIcoAhEMtA8J4jBqFC1Sk2A+ktHLBB2OGJs2ohL6l1EaIhH4vwLkaJQiAIiLZjFhs2Ic+psp5WRGGIBztQFeBcAOFWqQiGqWwJRaitFLDaRpNoxu9YcoJEfBkSx950jtm7JGTCPgByeSKtnU4ucFqBwNpgdx384ijkRP4TE94yqLEPmsES41SrpCHi4Xwx4iET0rvPEyi9lxUM4sgqOj4CSx2PEVDI7ZsqFW2NMeW6TcKhLwsaK+ykKjPTaujSuCTCb+EjA2bKmRfD+Fwh2NhGxMK3n2IcIhJd2ac25mMmpNCeokkpnKTECFSRnmHKdKZ8tFa6lCKrAZD186a2nnrZajV4l7NEZbII-E8FZAyHlB8ywIalU6WeAcMyZoNiIVPIu2BNllx2W4z5OjcSjgJKOewcQ8TbEcNkVIl4+rnTPCJHIolBx8IeXnZwLNkX4y+U3BMrgpIBECHKE6QCiXuTPmSzw7Z+lROvvSUpsLdZzwXqzJeWiUUeLWOSfimCSS+B2DkLwTt0J9jdjqWZPkYVWHvjzM44zoJ9QHJJYc0zHyDwJUAo4143Y4Qgb5KlC1Wba1fp+OlEcGVH3vJJbVB925pFQpGLYDrwE7GdYKwZlByIAHd+CYE5p+ewxrUpxD9USOG-gg1J1WL4CSLL0TDmVIkGSUC8hAA */
  id: "Plot Builder",

  initial: "No files & No Axis selected",

  context: {
    fileData: null,
  },

  states: {
    "No files & No Axis selected": {
      on: {
        "upload file clicked": "Upload a file",
        "add a file": "File & No axis selected",
      },
    },

    "Upload a file": {
      on: {
        "file uploaded successfully": {
          target: "No files & No Axis selected",
          actions: assign((context, event) => ({
            fileData: event.file,
          })),
        },
        "back to modify plot": "No files & No Axis selected",
        "file failed to upload": {
          target: "Upload a file",
        },
      },
    },

    "File & No axis selected": {
      description: `Within this state the plot type will be grayed out as well as the z, color and size axis`,

      on: {
        "select x axis": "One dimensional Plot",
        "select y axis": "Violin Plot",
        "select z axis": "Contour Plot",
      },
    },

    "One dimensional Plot": {
      on: {
        "select y axis": "Bar Chart",
        "select plot type": "new state 2",
      },
    },

    "Bar Chart": {
      on: {
        "select plot type": "2D PlotType Selected",
        "select color": "Coloured Bar Chart",
        "select z axis": "3D Scatter Plot",
      },
    },

    "2D PlotType Selected": {
      description: `This can be all the plot types with 2 dimensions, depending on what specific plot type is selected different options will be grayed out`,
    },

    "Violin Plot": {
      on: {
        "select x axis": [
          {
            target: "Bar Chart",
            cond: "x or y axis are not text",
          },
          {
            target: "Bar Chart",
            cond: "select pie chart",
          },
        ],
      },
    },

    "3D Scatter Plot": {
      on: {
        "select color": "Coloured 3D Scatter Plot",
      },
    },

    "Coloured Bar Chart": {
      description: `Gray out the size`,

      on: {
        "select plot type": "2D Coloured PlotType Selected",
        "select z axis": "Coloured 3D Scatter Plot",
      },
    },

    "Coloured 3D Scatter Plot": {
      on: {
        "select size": "5D Plot",
      },
    },

    "5D Plot": {},

    "2D Coloured PlotType Selected": {
      on: {
        "select z axis": "3D Scatter Plot",
      },
    },

    "Contour Plot": {
      on: {
        "select surface plot": "Surface Plot",
      },
    },

    "Surface Plot": {},
    "new state 2": {},
  },
});

export default wizStateMachine;
