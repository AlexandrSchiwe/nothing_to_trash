import React from 'react'
import "./login.scss"
import LoginForm from "./../components/LoginForm"

export default function Login(props) {
    return (
        <div>
            <div>
                <LoginForm setToken={props.setToken} />
            </div>
        </div>
    )
}
