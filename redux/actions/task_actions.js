import Cookie from 'js-cookie';
import * as types from '../actions/types';

export const toggleModalAC = () => {
  return {
    type: types.TOGGLE_MODAL
  };
};
export const infoToggleModalAC = () => {
  return {
    type: types.INFO_TOGGLE_MODAL
  };
};
export const save = (obj) => {
  return {
    type: types.SAVE_TASK,
    payload: obj
  };
};
export const saveArr = (objArr) => {
  return {
    type: types.SAVE_ARR,
    payload: objArr
  };
};
export const saveObjForInfo = (obj) => {
  return {
    type: types.SAVE_OBJ_FOR_INFO,
    payload: obj
  };
};

export const loadDataForInfo = (id, task__arr) => {
  return async (dispatch) => {
    let selectedObj = task__arr.find((item) => item.id == id);
    dispatch(saveObjForInfo(selectedObj));
  };
};
export const saveTask = (
  name,
  text,
  id,
  taskPriority,
  date,
  complitedDate,
  task__arr
) => {
  return async (dispatch) => {
    if (!taskPriority) {
      taskPriority = 'lowest';
    }
    console.log('task__arr from save task: ', task__arr);
    let taskObj = {
      id,
      name,
      text,
      status: 'new',
      taskPriority,
      dateTime: date,
      compliteDate: complitedDate
    };

    let newArr = task__arr;
    newArr.push(taskObj);
    const json = JSON.stringify(newArr);
    Cookie.set('obj', json);
    dispatch(saveArr(newArr));
  };
};
export const changePriority = (priority, item, task__arr) => {
  return async (dispatch) => {
    task__arr.map((i) => {
      if (i.id == item.id) {
        i.taskPriority = priority;
      }
    });
    const json = JSON.stringify(task__arr);
    Cookie.set('obj', json);
    dispatch(change(task__arr));
  };
};
export const addName = (name) => {
  return {
    type: types.ADD_NAME,
    name
  };
};
export const addText = (text) => {
  return {
    type: types.ADD_TEXT,
    text
  };
};
export const change = (task__arr) => {
  return {
    type: types.CHANGE_STATUS,
    task__arr
  };
};

export const delete_one = (task__arr) => {
  return {
    type: types.DELETE_ITEM,
    task__arr
  };
};
export const setPriority = (priority) => {
  return {
    type: types.SET_PRIORITY,
    payload: priority
  };
};

export const changeStatus = (id, status, task__arr) => {
  return async (dispatch) => {
    task__arr.map((item) => {
      if (item.id == id) {
        item.status = status;
      }
    });
    const json = JSON.stringify(task__arr);
    Cookie.set('obj', json);
    dispatch(change(task__arr));
  };
};
export const delete_item = (id, task__arr) => {
  return async (dispatch) => {
    let new_task_arr = [];
    if (task__arr) {
      task__arr.map((item) => {
        if (item.id !== id) {
          new_task_arr.push(item);
        }
      });
      dispatch(delete_one(new_task_arr));
    }
  };
};
