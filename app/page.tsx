"use client"

import {Grid, Box, Button} from "@mui/material";
import {useState} from "react";

const loginUser = async (setText: (e: string) => void, setError: (e: string) => void) => {
  try {
    let res = await fetch("/v1/user_login", {
        method: "POST",
        headers: {
          "Authorization": "Basic " + btoa("testuser:testpassword")
        }
    })

    if(res.status === 200) {
      let json = await res.json()
      setError("")
      setText(`Success returned user: ${JSON.stringify(json)}`)
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

export default function Home() {

  const [text, setText] = useState<string>("");
  const [error, setError] = useState<string>("");

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
          <Grid item xs={3}>
            <Button variant={"outlined"} onClick={() => loginUser(setText, setError)}>Login User</Button>
          </Grid>
          <Grid item xs={3}>
            <Button variant={"outlined"} onClick={() => listUsers(setText, setError)}>List Users</Button>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
