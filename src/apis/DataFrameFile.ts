import { CreateFileResponse } from "./schema";

export default class DataFrameFile {
  file: UserFile;
  file_content: UserFileContent;
  file_content_table: TabularData[];

  constructor(file_data: CreateFileResponse) {
    this.file = file_data.resource;
    this.file_content = this.convert_df_to_user_file_content(
      JSON.parse(file_data.resource_content)
    );
    this.file_content_table = this.convert_df_to_tabular_data(
      JSON.parse(file_data.resource_content)
    );
  }

  getUserFile = (): UserFile => {
    return {
      filename: this.file.filename,
      size: this.file.size,
      created_at: this.file.created_at,
      content: this.file_content,
      content_table: this.file_content_table,
    };
  };

  /**
   * Converts the data from a pd.DataFrame.to_json() format to an object
   * where each key is a column and each value is an array of row values.
   *
   * @param {DataFrame} dataFromBackend - Parsed objects from pd.DataFrame.to_json()
   * @returns {UserFileContent} - Object containing columns as keys and rows as arrays of values
   */
  convert_df_to_user_file_content = (dataFromBacked: DataFrame): UserFileContent => {
    const userFile: UserFileContent = {};
    const columns = Object.keys(dataFromBacked);
    columns.forEach((col) => {
      userFile[col] = [];
      const rows = Object.keys(dataFromBacked[col]);
      rows.forEach((row) => {
        userFile[col].push(dataFromBacked[col][row]);
      });
    });
    return userFile;
  };

  /**
   * Converts the data from a pd.DataFrame.to_json() format to an array of objects,
   * where each object represents a row with columns as keys and row values as values.
   *
   * @param {DataFrame} dataFromBackend - Parsed objects from pd.DataFrame.to_json()
   * @returns {TabularData[]} - Array of objects representing rows with columns as keys
   */
  convert_df_to_tabular_data = (dataFromBackend: DataFrame): TabularData[] => {
    const columns = Object.keys(dataFromBackend);
    const rows = Object.keys(dataFromBackend[columns[0]]);
    const data: TabularData[] = [];
    rows.forEach((r) => {
      let row: TabularData = {};
      columns.forEach((c) => {
        row[c] = dataFromBackend[c][r];
      });
      data.push(row);
    });
    return data;
  };
}

export type UserFile = {
  filename: string;
  size: number;
  created_at: Date;
  content: UserFileContent;
  content_table: TabularData[];
};

// this is an example of the Dataframe type
// = df = pd.DataFrame(data=[0,1,2,3])

// json.loads(df.to_json())

// {'0': {'0': 0, '1': 1, '2': 2, '3': 3}}
// Test
// const data: IDataFrame = {
//   '0': {
//     '0': 0,
//     '1': 1,
//     '2': 2,
//     '3': 3,
//   },
// };
// const value = data['0']['1']; // Access the value at row '0' and column '1'
// console.log(value); // Output: 1
type DataFrame = {
  [rowIndex: string]: {
    [columnIndex: string]: number;
  };
};

// this is a row which need to be passed to a tabular data array
// a tabular data array has the following structure:
// * [ { col1:value1 }, { col2 : value2 }...]}, .... ]
// where 1, 2 etc.. correspond to the indices of the rows in the data frame in json format
// here is an example of the tabular data array https://mui.com/material-ui/react-table/
export type TabularData = {
  [column: string]: any;
};

// since it is more organized to have an object for each file
// rather than an array of arrays, the UserFileContent is an object
// where each key is a column and each value of the key correspond to the rows of that column
export type UserFileContent = {
  [col: string]: any[];
};
