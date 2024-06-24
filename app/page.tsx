"use client"

import {Grid, Box, Button} from "@mui/material";
import {useState} from "react";

const loginUser = async (setText: (e: string) => void, setToken: (e: string) => void,  setError: (e: string) => void) => {
  try {
    let res = await fetch("/v1/user_login", {
        method: "POST",
        headers: {
          "Authorization": "Basic " + btoa("testuser:testpassword")
        }
    })

    if(res.status === 200) {
      let json = await res.json()

      if(json?.token === undefined) {
        setText("")
        setError(`Failed to login user: token not returned`)
        return
      }

      setError("")
      setToken(json.token)
      setText(`User logged in, click button to download token`)

    } else {

      setText("")
      setError(`Failed to login user: ${res.status}`)
    }

  } catch (e) {
    setText("")
    setError((e as Error).message)
  }
}

const listUsers = async (setText: (e: string) => void, setError: (e: string) => void) => {

  try {
    let res = await fetch("/v1/user_list", {
      method: "GET",
      headers: {
        "Authorization": "Basic " + btoa("testuser:testpassword")
      }
    })

    if(res.status === 200) {
      let json = await res.json()
      setError("")
      setText(`Success returned users: ${JSON.stringify(json)}`)
    } else {
      setText("")
      setError(`Failed to list users: ${res.status}`)
    }

  } catch (e) {
    setText("")
    setError((e as Error).message)
  }
}

const downloadToken = async (token: string, setText: (e: string) => void, setError: (e: string) => void) => {
  try {
    const element = document.createElement("a");
    const file = new Blob([token], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = "ap_placement.tkn";
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click()
  } catch (e) {
    setText("")
    setError((e as Error).message)
  }

  setText("Successfully downloaded token, checks downloads folder")
}

export default function Home() {

  const [text, setText] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [token, setToken] = useState<string>("");

  return (
    <Box display={"flex"} justifyContent={"center"} pt={4}>
      <Box maxWidth={"1000px"} width={"100%"}>
        <Grid container justifyContent={"center"}>
          { text &&
              <Grid item xs={12}>
                <Box p={2} borderRadius={2} bgcolor={"#8080804a"} border={"green 5px solid"}>
                  {text}
                </Box>
              </Grid>
          }
          { error &&
              <Grid item xs={12}>
                <Box p={2} borderRadius={2} bgcolor={"#8080804a"} border={"red 5px solid"}>
                  {error}
                </Box>
              </Grid>
          }
          <Grid item xs={12}>
            <Box p={1}></Box>
          </Grid>
          { token &&
              <Grid item xs={3}>
                <Button variant={"contained"} onClick={() => downloadToken(token, setText, setError)}>
                  Download Token
                </Button>
              </Grid>
          }
          { !token &&
              <Grid item xs={3}>
                <Button variant={"outlined"} onClick={() => loginUser(setText, setToken, setError)}>Login User</Button>
              </Grid>
          }
          <Grid item xs={3}>
            <Button variant={"outlined"} onClick={() => listUsers(setText, setError)}>List Users</Button>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
