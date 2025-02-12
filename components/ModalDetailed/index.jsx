import React, { useEffect, useRef, useState } from 'react';
import style from './index.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { infoToggleModalAC } from '../../redux/actions/task_actions';
import DatePicker from 'react-datepicker';
import { Formik, Field, Form } from 'formik';
import Image from 'next/image';

import {
  saveTask,
  addName,
  addText,
  setPriority,
  sendComment,
  changedName,
  changedComment,
  saveComArr
} from '../../redux/actions/task_actions';
import Cookie from 'js-cookie';

const ModalDetailed = ({ name, text, priority, dateStart, dateFinish }) => {
  const { taskName, textTask, taskPriority, selectedForInfo, task__arr } =
    useSelector((state) => state.task);
  const [dtemp, setDtemp] = useState(null);
  useEffect(() => {
    let dtm = Date.parse(selectedForInfo.dateTime);
    let dm = new Date(dtm);
    setDtemp(dm);
  }, [selectedForInfo]);
  const dispatch = useDispatch();
  const handleCloseModal = () => {
    dispatch(infoToggleModalAC());
  };

  const handeNameChanged = (e) => {
    dispatch(addName(e.target.value));
  };
  const handeTextChanged = (e) => {
    dispatch(addText(e.target.value));
    if (!e.target.value) {
      setTemp(false);
    } else {
      setTemp(true);
    }
  };

  const handePriorityChanged = (e) => {
    dispatch(setPriority(e.target.value));
  };
  let data;
  const convertDateFunc = (date) => {
    let newDate = Date.parse(date);
    let d = new Date(newDate);
    let yaer = d.getFullYear();
    let month = d.getMonth() + 1;
    let day = d.getDate();
    let stringCorrectDate = `${day} : ${month} : ${yaer}`;
    data = d;
    return stringCorrectDate;
  };

  const [startDate, setStartDate] = useState(new Date());

  const [temp, setTemp] = useState(true);
  const handleTouched = (e) => {
    if (!e.target.value) {
      setTemp(false);
    } else {
      setTemp(true);
    }
  };

  const [commentBtn, setCommentBtn] = useState(true);

  const handleCommentClick = (boo) => {
    setCommentBtn(boo);
  };

  const { userName, comment, comments } = useSelector((state) => state.comment);

  const handleSubmit = (idTask) => {
    dispatch(sendComment(userName, comment, comments.length, idTask, comments));
  };

  useEffect(() => {
    if (
      (userName == '' && userName.trim() == '') ||
      (comment == '' && comment.trim() == '')
    ) {
      setSendBlock(true);
    } else {
      setSendBlock(false);
    }
  }, [userName, comment]);
  const [nameState, setNameState] = useState(false);
  const [commentState, setCommentState] = useState(false);
  const HandleInput = (e) => {
    if (e.target.value == '') {
      setNameState(true);
    } else {
      setNameState(false);
    }
    dispatch(changedName(e.target.value));
  };
  const handleComment = (e) => {
    if (e.target.value == '') {
      setCommentState(true);
    } else {
      setCommentState(false);
    }
    dispatch(changedComment(e.target.value));
  };

  useEffect(() => {
    let comment__Arr = Cookie.get('comments');
    if (comment__Arr) {
      let cArr = JSON.parse(comment__Arr);
      dispatch(saveComArr(cArr));
    }
  }, []);

  const handleDeleteComment = (idCom, taskId) => {
    if (selectedForInfo.id == taskId) {
      comments.map((com) => {
        com.id == idCom && comments.splice(com.id, 1);
      });
    }
    dispatch(saveComArr(comments));
    const comArrJson = JSON.stringify(comments);
    Cookie.set('comments', comArrJson);
  };

  const [sendBlock, setSendBlock] = useState(true);

  return (
    <div className={style.modal}>
      <h1>Info Modal</h1>
      <span onClick={handleCloseModal} className={style.closeModal}>
        X
      </span>
      <Formik
        initialValues={{
          taskName: '',
          priority: '',
          dp: '',
          textTask: ''
        }}
      >
        <Form className="form">
          <div className={style.form_container}>
            <div className={style.info_container}>
              <div className="datePicker">
                <DatePicker
                  name="dp"
                  className={style.dp}
                  inline
                  selected={dtemp}
                  onChange={(date) => setStartDate(date)}
                />
              </div>
              <div className="otherFiled">
                <div>
                  <Field
                    autocomplete="off"
                    id="taskName"
                    name="taskName"
                    className={style.field__item}
                    placeholder="task name..."
                    value={selectedForInfo.name}
                    onChange={(e) => handeNameChanged(e)}
                  />
                </div>
                <div className={style.label}>
                  <label>{selectedForInfo.taskPriority}</label>
                </div>
                <div>
                  <textarea
                    id="textTask"
                    name="textTask"
                    rows="6"
                    value={selectedForInfo.text}
                    onChange={(e) => handeTextChanged(e)}
                    className={style.field__item}
                    placeholder="text name..."
                    onBlur={(e) => handleTouched(e)}
                  />
                </div>
                <div style={{ fontSize: '18px' }} className="dateFinish">
                  <label>Must be complited for</label> <br />
                  {convertDateFunc(selectedForInfo.compliteDate).toString()}
                </div>
                <br />
              </div>
            </div>
            <div className={style.comments}>
              <div className={style.comment_buttons}>
                <div
                  onClick={() => handleCommentClick(true)}
                  className={
                    commentBtn
                      ? `${style.comment_buttons_item} ${style.selected}`
                      : `${style.comment_buttons_item}`
                  }
                >
                  Leave Comment
                </div>
                <div
                  onClick={() => handleCommentClick(false)}
                  className={
                    !commentBtn
                      ? `${style.comment_buttons_item} ${style.selected}`
                      : `${style.comment_buttons_item}`
                  }
                >
                  Show all
                </div>
              </div>
              <div className={style.comments_field}>
                {commentBtn ? (
                  <div className={style.form}>
                    <input
                      value={userName}
                      onChange={(e) => HandleInput(e)}
                      placeholder="your name"
                    />
                    {nameState && (
                      <div style={{ fontSize: '15px', color: 'red' }}>
                        Поле name не может быть пустым
                      </div>
                    )}
                    <br />
                    <textarea
                      value={comment}
                      onChange={(e) => handleComment(e)}
                      placeholder="your comment"
                    ></textarea>
                    {commentState && (
                      <div style={{ fontSize: '15px', color: 'red' }}>
                        Поле name не может быть пустым
                      </div>
                    )}
                    <br />
                    <button
                      type="submit"
                      onClick={() => handleSubmit(selectedForInfo.id)}
                      disabled={sendBlock}
                    >
                      Send
                    </button>
                  </div>
                ) : (
                  <div>
                    {comments.length > 0 ? (
                      comments.map(
                        (item) =>
                          item.idTask == selectedForInfo.id && (
                            <>
                              <div className={style.comment_item}>
                                <div className="pic">
                                  <Image
                                    src={'/user.png'}
                                    alt="user pic"
                                    width={50}
                                    height={50}
                                  />
                                </div>
                                <div className={style.titleAndText}>
                                  <div>
                                    <strong className={style.names}>
                                      {item.name}
                                    </strong>
                                  </div>
                                  <div className={style.com}>
                                    {item.comment}
                                  </div>
                                </div>
                                <div
                                    onClick={(e) =>
                                      handleDeleteComment(item.id, item.idTask)
                                    }
                                    className={style.closeModal}
                                  >
                                    X
                                </div>
                              </div>
                            </>
                          )
                      )
                    ) : (
                      <div>no one comments yet</div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </Form>
      </Formik>
    </div>
  );
};

export default ModalDetailed;
