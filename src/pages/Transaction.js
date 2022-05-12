import React from "react"
import Navbar from "../component/Navbar"
import { base_url } from "../Config";
import axios from "axios"
import TransactionList from "../component/TransactionList"

export default class Transaction extends React.Component {
    constructor() {
        super()
        this.state = {
            token: "",
            user: null,
            transaksi: [],
        }


        if (localStorage.getItem("token") && localStorage.getItem("user")) {
            this.state.token = localStorage.getItem("token")
            this.state.user = JSON.parse(localStorage.getItem("user"))
        } else {
            window.location = "/login"
        }
    }
    headerConfig = () => {
        let header = {
            headers: { Authorization: `Bearer ${this.state.token}` }
        }
        return header
    }
    getTransaction = () => {
        let url = base_url + "/getIdTransaksi/" + this.state.user.idUser

        axios.get(url, this.headerConfig())
            .then(response => {
                this.setState({ transaksi: response.data })
            })
            .catch(error => {
                if (error.response) {
                    if (error.response.status) {
                        window.alert(error.response.data.message)
                        this.props.history.push("/login")
                    }
                } else {
                    console.log(error);
                }
            })
    }
    componentDidMount() {
        this.getTransaction()
    }

    render() {
        return (
            <div>
                <Navbar />

                <div className="container">
                    <h3 className="text-bold text-info mt-2">Transactions List</h3>
                    {this.state.transaksi.map(item => (
                        <TransactionList
                            key={item.idTransaksi}
                            transaction_id={item.transaksi_id}
                            customer_name={item.customer.name}
                            customer_address={item.customer.address}
                            time={item.waktu}
                            products={item.detail_transaksi}
                        />
                    ))}
                </div>
            </div>
        )
    }

}
