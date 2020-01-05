import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";

import Logo from "../../assets/nuresp.jpg";

import { Form, Container } from "./styles";

//import api from "../../services/api";

class Rescue extends Component {
   state = {
      email: "",
      error: ""
   };

   render() {
      return (
         <Container>
            <Form>
               <a target="_blank" rel="noopener noreferrer" href="http://www.nuresp.com.br/index.html">
                  <img src = { Logo } alt = "Nuresp logo" />
               </a>

               { this.state.error && <p> { this.state.error } </p> }

               <input
                  type = "email"
                  placeholder = "E-mail"
               />

               <button type = "submit"> Recuperar Senha </button>

               <hr />

               <Link to = "/"> Fazer Login </Link>

            </Form>

         </Container>
      );
   }
}

export default withRouter (Rescue);
