import { useState, useEffect } from "react";
import { fetchOrdersByUser } from "../services/orders.service";

export const useOrders = (userID, tokenID) => {
    const [isLoading, setIsLoading] = useState(false);
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState(null);

    useEffect(()=>{
        setIsLoading(true);
        fetchOrdersByUser(userID, tokenID)
            .then(data => {
                setOrders(data);
                setIsLoading(false);
            })
            .catch(error => {
                setError(error);
                setIsLoading(false);
            })
    },[userID, tokenID]);
    
    return { orders: orders, isLoading, error}
}
