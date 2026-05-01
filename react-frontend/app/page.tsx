"use client";

import * as React from 'react'
import Link from 'next/link'
import Image from "next/image";

export default function loginPage() {

    return(
        <main>
            <Link href={'/chat/'}>to chat</Link>
        </main>
    )
}