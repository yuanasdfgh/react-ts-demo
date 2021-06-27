import React from "react";

export const SearchPanel = ({ users, param, setParam }) => {
    return (
        <form>
            <div>
                <input
                    type="text"
                    value={param.name}
                    onChange={e => {
                        setParam({ ...param, name: e.target.value });
                    }}
                />
                <select
                    value={param.name}
                    onChange={e => {
                        setParam({ ...param, name: e.target.value });
                    }}
                >
                    <option value="">负责人</option>
                    {users.map(c => {
                        <option value={c.id}>{c.name}</option>;
                    })}
                </select>
            </div>
        </form>
    );
};
