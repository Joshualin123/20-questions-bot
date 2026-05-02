"use client";

import * as React from 'react'
import Link from 'next/link'
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Router } from 'next/router';

export default function loginPage() {

    const router = useRouter();

    const userRef = React.useRef<HTMLInputElement>(null);
    const passRef = React.useRef<HTMLInputElement>(null);

    const [user, setUser] = React.useState("")
    const [pass, setPass] = React.useState("")

    const [errMsg, setErrMsg] = React.useState("")

    const postAcc = (user : string, pass : string) => {
        fetch("http://localhost:8000/polls/authenticate-user/", {
            method: "POST",
            body: JSON.stringify([user, pass])
        })
        .then(res => res.json())
        .then(data => {
            
            if (data.status == "ok") {
                router.push("/chat")
                setErrMsg("")
            } else {
                setErrMsg(data.status)
                console.log("new err message: " + data.status)
            }
        })
    }

    React.useEffect(() => {

        if (userRef.current) {
            setUser(userRef.current.value)
        }
        if (passRef.current) {
            setPass(passRef.current.value)
        }
        
    }, [userRef.current, passRef.current])

    const handleLogin = () => {

        postAcc(user, pass) //send acc to backend, return status code
        
    };

    return(
        
        <main className="loginMain">
            <div className="login-title">20 Questions</div>
            {<div className="login-err-msg">{errMsg}</div>}
            <input value={user} onChange={event => {setUser(event.target.value)}} ref={userRef} className="login-input" placeholder="Username..." maxLength={20}></input>
            <input value={pass} onChange={event => {setPass(event.target.value)}} ref={passRef}  className="login-input" placeholder="Password..." maxLength={20}></input>
            <button className="login-button" onClick={handleLogin}>Login</button>

            <div className="signup-link-container">
                <div>Don't have an account? </div><Link className="signup-link" href="/sign-up/"> Sign Up</Link>
            </div>
        </main>
    )

}