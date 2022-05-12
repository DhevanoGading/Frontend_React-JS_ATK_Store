import React from "react"
import Navbar from "../component/Navbar"
import ProductList from "../component/ProductList"
import { base_url } from "../Config.js";
import axios from "axios"



export default class Product extends React.Component {
    constructor() {
        super()
        this.state = {
            products: [],
            token: "",
            action: "",
            namaProduk: "",
            deskripsiProduk: "",
            hargaProduk: 0,
            fotoProduk: "",
            uploadFile: true,
            idProduk: "",
            selectedItem: null
        }
        if (localStorage.getItem("token")) {
            this.state.token = localStorage.getItem("token")
        } else {
            window.location = "/login"
        }

        this.headerConfig.bind(this)
    }
    headerConfig = () => {
        let header = {
            headers: { Authorization: `Bearer ${this.state.token}` }
        }
        return header
    }
    getProduct = () => {
        let url = base_url + "/getProduk"
        axios.get(url, this.headerConfig())
            .then(response => {
                this.setState({ products: response.data.produk })
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
        this.getProduct()
    }

    render() {
        return (
            <div>
                <Navbar />
                <div className="container">
                    <h3 className="text-bold text-info mt-2">Product List</h3>
                    <div className="row">
                        {this.state.products.map(item => (
                            <ProductList
                                key={item.idProduk}
                                namaProduk={item.namaProduk}
                                deskripsiProduk={item.deskripsiProduk}
                                hargaProduk={item.hargaProduk}
                                fotoProduk={`http://localhost:8000/images/${item.fotoProduk}`}
                                onCart={() => this.addToCart(item)}
                            />
                        ))}
                    </div>
                </div>
            </div>
        )
    }
    addToCart = (selectedItem) => {
        // membuat sebuah variabel untuk menampung cart sementara
        let tempCart = []

        // cek eksistensi dari data cart pada localStorage
        if (localStorage.getItem("cart") !== null) {
            tempCart = JSON.parse(localStorage.getItem("cart"))
            // JSON.parse() digunakan untuk mengonversi dari string -> array object
        }

        // cek data yang dipilih user ke keranjang belanja
        let existItem = tempCart.find(item => item.idProduk === selectedItem.idProduk)

        if (existItem) {
            // jika item yang dipilih ada pada keranjang belanja
            window.alert(`Anda telah memilih ${selectedItem.namaProduk}`)
        } else {
            // user diminta memasukkan jumlah item yang dibeli
            let promptJumlah = window.prompt(`Masukkan jumlah ${selectedItem.name} yang beli`, "")
            if (promptJumlah !== null && promptJumlah !== "") {
                // jika user memasukkan jumlah item yg dibeli

                // menambahkan properti "jumlahBeli" pada item yang dipilih
                selectedItem.qty = promptJumlah

                // masukkan item yg dipilih ke dalam cart
                tempCart.push(selectedItem)

                // simpan array tempCart ke localStorage
                localStorage.setItem("cart", JSON.stringify(tempCart))
            }
        }
    }
}
