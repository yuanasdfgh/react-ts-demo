import React from "react";
export const List = ({ list, users }) => {
    return (
        <table>
            <thead>
                <tr>
                    <th>名称</th>
                    <th>负责人</th>
                </tr>
            </thead>
            {list.map(c => {
                <tr>
                    <td>{c.name}</td>
                    <td>{users}</td>
                </tr>;
            })}
            <tbody></tbody>
        </table>
    );
};
