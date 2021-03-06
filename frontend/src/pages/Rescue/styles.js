import styled from "styled-components";

export const Container = styled.div`
   display: flex;
   align-items: center;
   justify-content: center;
   height: 100vh;
`;

export const Form = styled.form `
   width: 400px;
   background: #fff;
   padding: 20px;
   display: flex;
   flex-direction: column;
   align-items: center;

   img {
      width: 500px;
      margin: 10px 0 50px;
   }
   p {
      color: #ff3333;
      font-size: 16px;
      font-weight: bold;
      background: #ffe;
      margin-bottom: 15px;
      border: 1px solid #ff3333;
      border-radius: 10px;
      padding: 10px;
      width: 100%;
      text-align: center;
   }
   input {
      flex: 1;
      height: 46px;
      margin-bottom: 15px;
      padding: 20px;
      color: #000;
      font-size: 16px;
      border-radius: 10px;
      width: 100%;
      border: 1px solid #ddd;
      &::placeholder {
         color: #999;
      }
   }
   button {
      color: #fff;
      font-size: 20px;
      background: rgb(30,100,255);
      height: 56px;
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
   a {
      font-size: 20px;
      font-weight: bold;
      color: #999;
      text-decoration: none;
   }
`;
