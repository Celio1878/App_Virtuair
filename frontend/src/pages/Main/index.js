import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";

import Logo from "../../assets/nuresp.jpg";

import { Form, Container } from "./styles";

//import api from "../../services/api";

class Main extends Component {

   state = {
      error: ""
   };

   render() {
      return (
         <Container>
            <img src = { Logo } alt = "Nuresp logo" />

            <Form>

               { this.state.error && <p> { this.state.error } </p> }

               <label> Novo Parceiro </label>

               <input
                  type = "text"
                  placeholder = "Nome *"
               />

               <input
                  type = "email"
                  placeholder = "E-mail *"
               />

               <input
                  type = "number"
                  placeholder = "CNPJ *"
               />

               <input
                  type = "text"
                  placeholder = "Endereço *"
               />

               <input
                  type = "number"
                  placeholder = "N° *"
               />

               <input
                  type = "number"
                  placeholder = "CEP *"
               />

               <input
                  type = "text"
                  placeholder = "Complemento"
               />

               <input
                  type = "text"
                  placeholder = "Bairro *"
               />

               <input
                  type = "text"
                  placeholder = "Cidade *"
               />

               <input
                  type = "text"
                  placeholder = "Estado *"
               />

               <input
                  type = "text"
                  placeholder = "Função *"
               />

               <input
                  type = "number"
                  placeholder = "N° de Registro *"
               />

               <button type = "submit" className = "signin"> Cadastrar </button>
               <button type = "submit" className = "cancel"> Cancelar </button>

               <Link to = "/signup" className = "add"> Novo Administrador </Link>
               <Link to = "/" className = "logout"> Logout </Link>
            </Form>

            <Form>

               { this.state.error && <p> { this.state.error } </p> }

               <label> Novo Cliente </label>

               <input
                  type = "text"
                  placeholder = "Nome *"
               />

               <input
                  type = "email"
                  placeholder = "E-mail *"
               />

               <input
                  type = "text"
                  placeholder = "Sexo"
               />

               <input
                  type = ""
                  placeholder = "Data de Nascimento *"
               />

               <input
                  type = "number"
                  placeholder = "CPF *"
               />

               <input
                  type = "number"
                  placeholder = "RG *"
               />

               <input
                  type = "number"
                  placeholder = "Telefone *"
               />

               <input
                  type = "text"
                  placeholder = "Endereço *"
               />

               <input
                  type = "number"
                  placeholder = "N° *"
               />

               <input
                  type = "number"
                  placeholder = "CEP *"
               />

               <input
                  type = "text"
                  placeholder = "Complemento"
               />

               <input
                  type = "text"
                  placeholder = "Bairro *"
               />

               <input
                  type = "text"
                  placeholder = "Cidade *"
               />

               <input
                  type = "text"
                  placeholder = "Estado *"
               />

               <button type = "submit" className = "signin"> Cadastrar </button>
               <button type = "submit" className = "cancel"> Cancelar </button>

            </Form>

            <Form>

               { this.state.error && <p> { this.state.error } </p> }

               <label> Novo Aparelho Nuresp </label>

               <input
                  type = ""
                  placeholder = "Modelo *"
               />

               <input
                  type = "number"
                  placeholder = "Serial *"
               />

               <input
                  type = "boolean"
                  placeholder = "Status"
               />

               <input
                  type = "text"
                  placeholder = "Alocação"
               />

               <input
                  type = "text"
                  placeholder = "Ações"
               />

               <button type = "submit" className = "signin"> Cadastrar </button>
               <button type = "submit" className = "cancel"> Cancelar </button>

            </Form>

         </Container>
      );
   }
}

export default withRouter (Main);
