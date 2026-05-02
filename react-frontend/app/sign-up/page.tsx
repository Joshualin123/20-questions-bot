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
    const rePassRef = React.useRef<HTMLInputElement>(null);

    const [user, setUser] = React.useState("")
    const [pass, setPass] = React.useState("")
    const [repass, setRePass] = React.useState("")

    const [errMsg, setErrMsg] = React.useState("")

    const postAcc = (user : string, pass : string) => {
        fetch("http://localhost:8000/polls/create-user/", {
            method: "POST",
            body: JSON.stringify([user, pass])
        })
        .then(res => res.json())
        .then(data => {
            
            if (data.status == "ok") {
                router.push("/")
                setErrMsg("")
            } else {
                setErrMsg(data.status)
                console.log("new err message: " + data.status)
            }
        })
    }

    const handleSignUp = () => {

        if (pass.trim() == repass.trim()) { //if passwords match
            if (pass.trim().length >= 10) { //only post if min length
                postAcc(user, pass); //send acc to backend, return status code
            } else {
                setErrMsg("Password too short.");
                return;
            }

        } else {
            setErrMsg("Passwords do not match.");
            console.log("Passwords do not match.");
        }
        
        
    };

    return(
        
        <main className="loginMain">
            
            <div className="signup-title">20 Questions</div>

            <div className="login-err-msg">{errMsg}</div>

            <input value={user} onChange={(val) => {setUser(val.target.value)}} ref={userRef} className="login-input" placeholder="Username..." maxLength={20}></input>
            <input value={pass} onChange={(val) => {setPass(val.target.value)}} ref={passRef} className="login-input" placeholder="Password..." maxLength={20}></input>
            <input value={repass} onChange={(val) => {setRePass(val.target.value)}} ref={rePassRef} className="login-input" placeholder="Re-enter password..." maxLength={20}></input>
            <button className="login-button" onClick={handleSignUp}>Create Account</button>

            <div className="login-link-container">
                <div>Already have an account? </div><Link className="signup-link" href="/"> Login</Link>
            </div>
        </main>
    )

}