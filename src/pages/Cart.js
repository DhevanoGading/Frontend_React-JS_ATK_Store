import React from "react"
import Navbar from "../component/Navbar"
import { base_url } from "../Config";
import axios from "axios"


export default class Cart extends React.Component {
    constructor() {
        super()
        this.state = {
            token: "",
            id_user: "",
            nama_user: "",
            cart: [], // untuk menyimpan list cart
            total: 0, // untuk menyimpan data total belanja
        }

        if (localStorage.getItem("token")) {
            this.state.token = localStorage.getItem("token")
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
    initCart = () => {
        // memanggil data cart pada localStorage
        let tempCart = []
        if (localStorage.getItem("cart") !== null) {
            tempCart = JSON.parse(localStorage.getItem("cart"))
        }

        if (localStorage.getItem("user") !== null) {
            let customer = JSON.parse(localStorage.getItem("user"))
            this.setState({
                id_user: customer.idUser,
                nama_user: customer.namaUser
            })
        }

        // kalkulasi total harga
        let totalHarga = 0;
        tempCart.map(item => {
            totalHarga += (item.hargaProduk * item.qty)
        })

        // memasukkan data cart, user, dan total harga pada state
        this.setState({
            cart: tempCart,
            total: totalHarga
        })
    }
    componentDidMount() {
        this.initCart()
    }

    render() {
        return (
            <div>
                <Navbar />
                <div className="container">
                    <div className="card col-12 mt-2">
                        <div className="card-header bg-primary text-white">
                            <h4>Cart List</h4>
                        </div>

                        <div className="card-body">
                            <h5 className="text-primary">
                                User: {this.state.nama_user}
                            </h5>

                            <table className="table table-bordered">
                                <thead>
                                    <tr>
                                        <th>Product</th>
                                        <th>Price</th>
                                        <th>Qty</th>
                                        <th>Total</th>
                                        <th>Option</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {this.state.cart.map((item, index) => (
                                        <tr key={index}>
                                            <td>{item.namaProduk}</td>
                                            <td>Rp {item.hargaProduk}</td>
                                            <td>{item.qty}</td>
                                            <td className="text-right">
                                                Rp {item.hargaProduk * item.qty}
                                            </td>
                                            <td>
                                                <button className="btn btn-sm btn-info m-1"
                                                    onClick={() => this.editItem(item)}>
                                                    Edit
                                                </button>

                                                <button className="btn btn-sm btn-danger m-1"
                                                    onClick={() => this.dropItem(item)}>
                                                    Hapus
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    <tr>
                                        <td colSpan="3">Total</td>
                                        <td className="text-right">Rp {this.state.total}</td>
                                        <td>
                                            <button className="btn btn-sm btn-success btn-block m-1"
                                                onClick={() => this.checkOut()}
                                                disabled={this.state.cart.length === 0}>
                                                Checkout
                                            </button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    editItem = selectedItem => {
        let tempCart = []
        if (localStorage.getItem("cart") !== null) {
            tempCart = JSON.parse(localStorage.getItem("cart"))
        }

        let index = tempCart.findIndex(it => it.idProduk === selectedItem.idProduk)
        let promptJumlah = window.prompt(`Masukkan jumlah ${selectedItem.name} yang beli`, selectedItem.qty)
        tempCart[index].qty = promptJumlah

        // update localStorage
        localStorage.setItem("cart", JSON.stringify(tempCart))

        // refersh cart
        this.initCart()
    }
    dropItem = selectedItem => {
        if (window.confirm(`Apakah anda yakin menghapus ${selectedItem.name} dari cart?`)) {
            let tempCart = []
            if (localStorage.getItem("cart") !== null) {
                tempCart = JSON.parse(localStorage.getItem("cart"))
            }

            let index = tempCart.findIndex(it => it.idProduk === selectedItem.idProduk)
            tempCart.splice(index, 1)

            // update localStorage
            localStorage.setItem("cart", JSON.stringify(tempCart))

            // refersh cart
            this.initCart()
        }
    }
    checkOut = () => {
        let tempCart = []
        if (localStorage.getItem("cart") !== null) {
            tempCart = JSON.parse(localStorage.getItem("cart"))
        }

        let data = {
            idUser: this.state.id_user,
            detailtransaksi: tempCart
        }
        //masih bingung
        let url = base_url + "/tambahTransaksi"

        axios.post(url, data, this.headerConfig())
            .then(response => {
                // clear cart
                window.alert(response.data.message)
                localStorage.removeItem("cart")
                window.location = "/transaction"
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

}