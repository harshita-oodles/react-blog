import { useEffect, useState } from "react";

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetch("http://127.0.0.1:8000/admin/users/", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,  // Ensure admin is authenticated
            },
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Not authorized");
            }
            return response.json();
        })
        .then(data => setUsers(data))
        .catch(error => console.error(error));
    }, []);

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Admin Dashboard - User Management</h2>
            <table className="w-full border-collapse border border-gray-300">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="border p-2">ID</th>
                        <th className="border p-2">Username</th>
                        <th className="border p-2">Email</th>
                        <th className="border p-2">Admin</th>
                        <th className="border p-2">Date Joined</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.id}>
                            <td className="border p-2">{user.id}</td>
                            <td className="border p-2">{user.username}</td>
                            <td className="border p-2">{user.email}</td>
                            <td className="border p-2">{user.is_staff ? "Yes" : "No"}</td>
                            <td className="border p-2">{new Date(user.date_joined).toLocaleDateString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminDashboard;
