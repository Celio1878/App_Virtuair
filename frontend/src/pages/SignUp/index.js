import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";

import Logo from "../../assets/nuresp.jpg";

import { Form, Container } from "./styles";

import api from "../../services/api";

class SignUp extends Component {
   state = {
      username: "",
      email: "",
      password: "",
      error: ""
   };

   handleSignUp = async e => {
      e.preventDefault();

      const { username, email, password } = this.state;

      if (!username || !email || !password) {
         this.setState({ error: "Preencha todos os campos corretamente para se cadastrar"});
      } else {
         try {
            await api.post("/users", { username, email, password });
            this.props.history.push ("/");
         } catch (err) {
            console.log(err);
            this.setState ({ error: "Ocorreu um erro ao registrar sua conta."});
         }
      }
   };

   render() {
      return (
         <Container>
            <Form onSubmit = { this.handleSignUp }>
               <a target="_blank" rel="noopener noreferrer" href="http://www.nuresp.com.br/index.html">
                  <img src = { Logo } alt = "Nuresp logo" />
               </a>

               { this.state.error && <p> { this.state.error } </p> }

               <input
                  type = "text"
                  placeholder = "Nome de usuário"
                  onChange = { e => this.setState ({ username: e.target.value })}
               />

               <input
                  type = "email"
                  placeholder = "E-mail"
                  onChange = { e => this.setState ({ email: e.target.value })}
               />

               <input
                  type = "password"
                  placeholder = "Senha"
                  onChange = { e => this.setState ({ password: e.target.value })}
               />

               <button type = "submit"> Cadastrar </button>

               <hr />

               <Link to = "/"> Fazer Login </Link>

            </Form>

         </Container>
      );
   }
}

export default withRouter (SignUp);
