import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";

import Logo from "../../assets/nuresp.jpg";
import api from "../../services/api";
import { login } from "../../services/auth";

import { Form, Container } from "./styles";

class SignIn extends Component {
   state = {
      email: "",
      password: "",
      error: ""
   };

   handleSignIn = async e => {
      e.preventDefault();

      const { email, password } = this.state;

      if(!email || !password) {
         this.setState({ error: "Preencha e-mail e senha corretamente!!!"});
      } else {
         try {
            const response = await api.post("/sessions", { email, password });

            login (response.data.token);
            this.props.history.push("/main");
         } catch (err) {
            this.setState ({
               error: "Houve um problema com o login, verifique suas credenciais."
            });
         }
      }
   };

   render() {
      return (
         <Container>
            <Form onSubmit = {this.handleSignIn}>
               <a target="_blank" rel="noopener noreferrer" href="http://www.nuresp.com.br/index.html">
                  <img src = { Logo } alt = "Nuresp logo" />
               </a>

               {this.state.error && <p> {this.state.error} </p>}

               <input
                  type = "email"
                  placeholder = "E-mail *"
                  onChange = { e => this.setState ({ email: e.target.value })}
               />
               <input
                  type = "password"
                  placeholder = "Senha *"
                  onChange = { e => this.setState ({ password: e.target.value })}
               />

               <button type = "submit"> Entrar </button>

               <hr />

               <Link to = "/rescue" > Recuperar Senha </Link>
            </Form>
         </Container>
      );
   }
}

export default withRouter (SignIn);
