import { Action } from "routing-controllers";

// tslint:disable-next-line:variable-name
export default function(message: string = "Success") {
  return (action: Action, data: any): any => {
    // here you have content returned by this action. you can replace something
    // in it and return a replaced result. replaced result will be returned to the user
    // return content.replace(/Mike/gi, "Michael");
    return {
      message,
      data
    };
  };
}
