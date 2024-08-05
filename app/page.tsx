"use client"

import {Grid, Box, Button, Typography, Paper, Alert, Snackbar} from "@mui/material";
import {useState} from "react";

// const API_URL = "http://127.0.0.1:3000/api"
const API_URL = "/v1"

export default function Home() {

  const [text, setText] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [token, setToken] = useState<string>("");
  const [users, setUsers] = useState<User[]>([]);

  return (
      <Box display={"flex"} justifyContent={"center"} pt={4}>
        <Box maxWidth={"1000px"} width={"100%"}>
          <Grid container justifyContent={"center"}>
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
              <Button variant={"outlined"} onClick={() => users.length == 0 ? listUsers(setUsers, setError) : setUsers([])}>List Users</Button>
            </Grid>
            { text &&
                <Snackbar open={open} onClose={() => setText("")}>
                  <Alert
                      onClose={() => setText("")}
                      severity="success"
                      variant="filled"
                      sx={{ width: '100%' }}
                  >
                    {text}
                  </Alert>
                </Snackbar>
            }
            { error &&
                <Snackbar open={open} onClose={() => setError("")}>
                  <Alert
                      onClose={() => setError("")}
                      severity="error"
                      variant="filled"
                      sx={{ width: '100%' }}
                  >
                    {error}
                  </Alert>
                </Snackbar>
            }
            { users.length != 0 &&
                <Grid item xs={12}>
                  <Grid container spacing={1}>
                    <Grid item xs={12}>
                      <UserCard username={"Username"} localAccount={"Local Account"} accountCreated={"Account Created"} tokenExpires={"Token Expires"} />
                    </Grid>
                    { users.map((user) => <Grid item xs={12}><UserCard {...user} /></Grid>) }
                  </Grid>
                </Grid>
            }
          </Grid>
        </Box>
      </Box>
  );
}

interface User {
  username: string;
  localAccount: string;
  accountCreated: string;
  tokenExpires: string;
}

const UserCard = ({...props}: User) => {
  return (
      <Paper m={1}>
        <Box p={1}>
          <Grid container spacing={2}>
            <Grid item xs={3}>
              <Typography variant={"body1"}>{props.username}</Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography variant={"body1"}>{props.localAccount}</Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography variant={"body1"}>{props.accountCreated}</Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography variant={"body1"}>{props.tokenExpires}</Typography>
            </Grid>
          </Grid>
        </Box>

      </Paper>
  )
}

const loginUser = async (setText: (e: string) => void, setToken: (e: string) => void,  setError: (e: string) => void) => {
  try {
    let res = await fetch(API_URL + "/user_login", {
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

const listUsers = async (setUsers: (u: User[]) => void, setError: (e: string) => void) => {

  try {
    let res = await fetch(API_URL + "/user_list", {
      method: "GET",
      headers: {
        "Authorization": "Basic " + btoa("testuser:testpassword")
      }
    })

    if(res.status === 200) {
      let json = await res.json()
      setError("")
      setUsers(json)
    } else {
      setUsers([])
      setError(`Failed to list users: ${res.status}`)
    }

  } catch (e) {
    setUsers([])
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


