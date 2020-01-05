import styled from "styled-components";

export const Container = styled.div`
   display: flex;
   align-items: center;
   justify-content: center;
   height: 100vh;
   img {
      position: absolute;
      align-items: center;
      justify-content: center;
      width: 95%;
      margin: 10px 0 50px;
      opacity: 0.1;
   }
`;

export const Form = styled.form`
   width: 400px;
   background: #fff;
   padding: 20px;
   display: flex;
   flex-direction: column;
   align-items: center;
   p {
      color: #ff3333;
      font-weight: bold;
      margin-bottom: 16px;
      border: 1px solid #ff3333;
      border-radius: 10px;
      background: #ffe;
      padding: 10px;
      width: 100%;
      text-align: center;
   }
   input {
      z-index: 1;
      flex: 1;
      height: 45px;
      margin-bottom: 12px;
      border-radius: 10px;
      padding: 10px;
      color: #000;
      font-size: 15px;
      width: 100%;
      border: 1px solid #ddd;
      &::placeholder {
         color: #999;
      }
   }
   button {
      color: #fff;
      font-size: 15px;
      background: rgb(30,100,255);
      height: 45px;
      border: 0;
      border-radius: 10px;
      width: 100%;
      cursor: pointer;
   }
   button:hover {
      background: rgb(30,125,255)
   }
   hr {
      margin: 20px 0;
      border: none;
      border-bottom: 1px solid #cdcdcd;
      width: 100%;
   }
   .add {
      position: absolute;
      top: 2%;
      right: 88%;
      font-size: 18px;
      font-weight: bold;
      color: rgb(30,100,255);
      text-decoration: none;
   }
   .logout {position: absolute;
      top: 2%;
      left: 94%;
      font-size: 18px;
      font-weight: bold;
      color: rgb(255, 0, 0);
      text-decoration: none;
   }
   label {
      font-size: 25px;
      font-weight: bold;
      color: #999;
      margin-bottom: 15px;
   }
   .cancel {
      margin-top: 15px;
      background: rgb(255, 0, 0)
   }
   .cancel:hover {
      background: rgb(230, 30, 30)
   }
`;
