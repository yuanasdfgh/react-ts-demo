import axios from "axios";
import React, { useEffect, useState } from "react";

import { List } from "./list";
import { SearchPanel } from "./search-panel";
// const apiUrl = process.env.REACT_APP_API_URL;

export const ProjectList = () => {
    const [param, setParam] = useState({ name: "", personId: "" });
    const [list, setList] = useState([]);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:3001/users").then(res => {
            setUsers(res.data);
            console.log(res, "_______");
        });
    }, []);
    useEffect(() => {
        axios.get(`http://localhost:3001/projects`).then(res => {
            console.log(res, "-----");
            setList(res.data);
        });
    }, [param]);

    return (
        <div>
            <SearchPanel users={users} param={param} setParam={setParam}></SearchPanel>
            <List users={users} list={list}></List>
        </div>
    );
};
