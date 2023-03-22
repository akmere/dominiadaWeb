"use client"
import React from 'react'
import { useSession, signIn, signOut } from "next-auth/react"
import useSWR from 'swr';

async function processInstancesData(url) {
    console.log('haha');
    let response = await fetch(url);
    console.log(`data: ${response}`);
    let json = await response.json();
    console.log(json);
    return json;
}

export default function Admin() {
    const { data: session, status } = useSession();
    const {data, mutate, error, isLoading} = useSWR(status === "authenticated" ? '/api/admin/instances' : null, processInstancesData);
    const userEmail = session?.user.email;

    function handleInstanceSelectChange(e) {
        let newValue = e.target.value;
        let textArea = document.querySelector('#instance-text-area');
        if(textArea) {
            if(!newValue) textArea.value = '';
            else {
                let configValue = data.find(instance => instance.name === newValue)?.config;
                if(configValue) textArea.value = JSON.stringify(configValue, null, '\t');
                else textArea.value = "";
            }
        }
    }

    async function handleRoomRestart(e) {
        let restartButton = document.querySelector('#restart-room-button');
        restartButton.disabled = true;
        let newValue = document.querySelector('#instance-select')?.value;
        let textArea = document.querySelector('#instance-text-area')?.value;
        let token = document.querySelector('#token-input')?.value;
        if(!newValue || !token) {
            restartButton.disabled = false;
            return;
        }
        let jsonData = {};
        jsonData.instance = newValue;
        jsonData.token = token;
        jsonData.config = textArea ? textArea : null;
        await fetch('/api/admin/startServer', {method : "POST", body : JSON.stringify(jsonData), headers : {"Content-Type" : "application/json"}});
        mutate();
        restartButton.disabled = false;
    }

    if (status === "loading") {
        return (
            <div>Loading Admin</div>
        )
    }

    if (status === "authenticated") {
        // console.log(instances);
        return (
            <div style={{display: 'flex', flexDirection: 'column', gap:'5px'}}>
                <label for='instance-select'>Select Instance</label>
                <select id='instance-select' onChange={handleInstanceSelectChange} style={{width:'200px'}}>
                    <option></option>
                    {data && data.map((instance, key) => {
                        return <option value={instance.name} key={instance.name}>{instance.name}</option>
                    })}
                </select>
                <label for='instance-text-area'>Config</label>
                <textarea id='instance-text-area' style={{height: '800px', width: '800px'}}></textarea>
                <label for='token-input'>Token [<a href='https://www.haxball.com/headlesstoken'>Get HERE</a>]</label>
                <input id='token-input' style={{width: '500px'}}></input>
                <button id='restart-room-button' onClick={handleRoomRestart} style={{width: '100px'}}>RESTART</button>
            </div>
        )
    }

    return (
        <>
            <div>Not signed in</div>
            <button onClick={() => signIn("github")}>Sign in</button>
        </>
    )
}
