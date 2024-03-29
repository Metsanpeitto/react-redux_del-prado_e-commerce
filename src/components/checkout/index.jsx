import React, { Component } from "react";
import { Helmet } from "react-helmet";
import { connect } from "react-redux";
import PaypalExpressBtn from "react-paypal-express-checkout";
import SimpleReactValidator from "simple-react-validator";
import NumberFormat from "react-number-format";
import { Elements } from "react-stripe-elements";
import { withTranslate } from "react-redux-multilingual";

import Banner from "../elements/element-banner";
import CheckoutForm from "./CheckoutForm";
import Breadcrumb from "../breadcrumb";
import {
  removeFromWishlist,
  placeOrder,
  clearCart,
  signup,
} from "../../actions/indexO";
import { getCartTotal } from "../../services";

class checkOut extends Component {
  constructor(props) {
    super(props);

    this.state = {
      payment: "stripe",
      username: "",
      password: "",
      first_name: "",
      last_name: "",
      phone: "",
      email: "",
      country: "",
      address_1: "",
      city: "",
      state: "",
      postcode: "",
      cart: [],
      total: null,
      create_account: "",
    };
    this.validator = new SimpleReactValidator();
    this.createOrderData = this.createOrderData.bind(this);
  }

  componentDidMount() {
    if (this.props.cartItems.length > 0) {
      this.setState(() => {
        return {
          cart: this.props.cartItems,
          total: this.props.total,
        };
      });
    }

    if (this.props.user.log) {
      if (this.props.user.log.username) {
        this.fillFields(this.props);
      }
    }
  }

  fillFields = (props) => {
    const {
      first_name,
      last_name,
      phone,
      email,
      country,
      address_1,
      city,
      state,
      postcode,
    } = props.user.log;
    const cart = props.cartItems;
    const total = props.total;

    this.setState(() => {
      return {
        first_name: first_name,
        last_name: last_name,
        phone: phone,
        email: email,
        country: country,
        address_1: address_1,
        city: city,
        state: state,
        postcode: postcode,
        cart: cart,
        total: total,
      };
    });
  };

  createOrderData() {
    var orderData = {
      username: this.state.username,
      email: this.state.email,
      // password : this.state.password,
      address_1: this.state.address_1,
      city: this.state.city,
      country: this.state.country,
      first_name: this.state.first_name,
      last_name: this.state.last_name,
      phone: this.state.phone,
      postcode: this.state.postcode,
      state: this.state.state,
      cart: this.state.cart,
      total: this.state.total,
    };
    return orderData;
  }

  setStateFromInput = (event) => {
    var obj = {};
    obj[event.target.name] = event.target.value;
    this.setState(obj);
  };

  setStateFromCheckbox = (event) => {
    console.log(event);
    var obj = {};
    obj[event.target.name] = event.target.checked;
    this.setState(obj);
    if (!this.validator.fieldValid(event.target.name)) {
      this.validator.showMessages();
    }
  };

  checkhandle(value) {
    this.setState({
      payment: value,
    });
  }

  callSignup = () => {
    if (this.state.create_account) {
      const {
        first_name,
        last_name,
        phone,
        email,
        country,
        address_1,
        city,
        state,
        postcode,
      } = this.state;

      const userData = {
        username: this.state.username,
        first_name: first_name,
        password: this.state.password,
        last_name: last_name,
        phone: phone,
        email: email,
        country: country,
        address_1: address_1,
        city: city,
        state: state,
        postcode: postcode,
      };
      this.props.signup(userData);
    }
  };

  Username = () => {
    if (this.state.create_account) {
      return (
        <div className="d-c">
          <div className="form-group col-md-6 col-sm-6 col-xs-12">
            <div className="field-label">User Name</div>
            <input
              type="text"
              name="username"
              className="form-control"
              value={this.state.username}
              onChange={this.setStateFromInput}
            />
            {this.validator.message(
              "username",
              this.state.username,
              "required|alpha"
            )}
          </div>
          <div className="form-group col-md-6 col-sm-6 col-xs-12">
            <div className="field-label">Password</div>
            <input
              type="password"
              name="password"
              className="form-control"
              value={this.state.password}
              onChange={this.setStateFromInput}
            />
            {this.validator.message(
              "password",
              this.state.password,
              "required"
            )}
          </div>
        </div>
      );
    } else {
      return null;
    }
  };

  doOrder = (flag) => {
    this.props.placeOrder(this.createOrderData());
  };

  render() {
    const { cartItems, symbol, total, translate } = this.props;
    // Paypal Integration
    const onSuccess = (payment) => {
      this.props.history.push({
        pathname: "/order-success",
        state: {
          payment: payment,
          items: cartItems,
          orderTotal: total,
          symbol: symbol,
        },
      });
    };

    const onCancel = (data) => {
      console.log("The payment was cancelled!", data);
    };

    const onError = (err) => {
      console.log("Error!", err);
    };

    const client = {
      sandbox:
        "AZ4S98zFa01vym7NVeo_qthZyOnBhtNvQDsjhaZSMH-2_Y9IAJFbSD3HPueErYqN8Sa8WYRbjP7wWtd_",
      production:
        "AZ4S98zFa01vym7NVeo_qthZyOnBhtNvQDsjhaZSMH-2_Y9IAJFbSD3HPueErYqN8Sa8WYRbjP7wWtd_",
    };

    return (
      <div>
        {/*SEO Support*/}
        <Helmet>
          <title>Del Prado | CheckOut Page</title>
          <meta
            name="description"
            content="Del Prado – La mejor calidad de Asturias ahora online."
          />
        </Helmet>
        {/*SEO Support End */}

        <Breadcrumb title={"Checkout"} />
        <section className="section-b-space">
          <div className="container padding-cls">
            <Banner />
            <div className="checkout-page">
              <div className="checkout-form">
                <form>
                  <div className="checkout row">
                    <div className="col-lg-6 col-sm-12 col-xs-12">
                      <div className="checkout-title">
                        <h3>{translate("billing")}</h3>
                      </div>
                      <div className="row check-out">
                        <this.Username />
                        <div className="form-group col-md-6 col-sm-6 col-xs-12">
                          <div className="field-label">
                            {translate("first_name")}
                          </div>
                          <input
                            type="text"
                            name="first_name"
                            placeholder="First Name"
                            required=""
                            className="form-control"
                            value={this.state.first_name}
                            onChange={this.setStateFromInput}
                          />
                          {this.validator.message(
                            "first_name",
                            this.state.first_name,
                            "required|alpha"
                          )}
                        </div>
                        <div className="form-group col-md-6 col-sm-6 col-xs-12">
                          <div className="field-label">
                            {translate("last_name")}
                          </div>
                          <input
                            type="text"
                            name="last_name"
                            placeholder="Last Name"
                            className="form-control"
                            value={this.state.last_name}
                            onChange={this.setStateFromInput}
                          />
                          {this.validator.message(
                            "last_name",
                            this.state.last_name,
                            "required|alpha"
                          )}
                        </div>
                        <div className="form-group col-md-6 col-sm-6 col-xs-12">
                          <div className="field-label">
                            {translate("phone")}
                          </div>
                          <input
                            type="text"
                            name="phone"
                            className="form-control"
                            placeholder="Phone"
                            value={this.state.phone}
                            onChange={this.setStateFromInput}
                          />
                          {this.validator.message(
                            "phone",
                            this.state.phone,
                            "required|phone"
                          )}
                        </div>
                        <div className="form-group col-md-6 col-sm-6 col-xs-12">
                          <div className="field-label">
                            {translate("email_address")}
                          </div>
                          <input
                            type="text"
                            name="email"
                            placeholder="Email"
                            className="form-control"
                            value={this.state.email}
                            onChange={this.setStateFromInput}
                          />
                          {this.validator.message(
                            "email",
                            this.state.email,
                            "required|email"
                          )}
                        </div>
                        <div className="form-group col-md-12 col-sm-12 col-xs-12">
                          <div className="field-label">
                            {translate("country")}
                          </div>
                          <input
                            type="text"
                            name="country"
                            placeholder="Country"
                            className="form-control"
                            value={this.state.country}
                            onChange={this.setStateFromInput}
                          />
                          {this.validator.message(
                            "country",
                            this.state.country,
                            "required"
                          )}
                        </div>
                        <div className="form-group col-md-12 col-sm-12 col-xs-12">
                          <div className="field-label">
                            {translate("address")}
                          </div>
                          <input
                            id="address_1"
                            type="text"
                            className="form-control"
                            placeholder="Address"
                            required=""
                            name="address_1"
                            value={this.state.address_1}
                            onChange={this.setStateFromInput}
                          />
                          {this.validator.message(
                            "address_1",
                            this.state.address_1,
                            "required|min:2|max:120"
                          )}
                        </div>
                        <div className="form-group col-md-12 col-sm-12 col-xs-12">
                          <div className="field-label">{translate("city")}</div>
                          <input
                            type="text"
                            name="city"
                            placeholder="City"
                            className="form-control"
                            value={this.state.city}
                            onChange={this.setStateFromInput}
                          />
                          {this.validator.message(
                            "city",
                            this.state.city,
                            "required|alpha"
                          )}
                        </div>
                        <div className="form-group col-md-12 col-sm-6 col-xs-12">
                          <div className="field-label">
                            {translate("state")}
                          </div>
                          <input
                            type="text"
                            name="state"
                            placeholder="State"
                            className="form-control"
                            value={this.state.state}
                            onChange={this.setStateFromInput}
                          />
                          {this.validator.message(
                            "state",
                            this.state.state,
                            "required|alpha"
                          )}
                        </div>
                        <div className="form-group col-md-12 col-sm-6 col-xs-12">
                          <div className="field-label">
                            {translate("postal")}
                          </div>
                          <input
                            type="text"
                            name="postcode"
                            placeholder="Postal Code"
                            className="form-control"
                            value={this.state.postcode}
                            onChange={this.setStateFromInput}
                          />
                          {this.validator.message(
                            "postcode",
                            this.state.postcode,
                            "required|integer"
                          )}
                        </div>
                        <div className="form-group col-lg-12 col-md-12 col-sm-12 col-xs-12">
                          <input
                            type="checkbox"
                            name="create_account"
                            id="account-option"
                            checked={this.state.create_account}
                            onChange={this.setStateFromCheckbox}
                          />
                          &ensp;{" "}
                          <label htmlFor="account-option">
                            {translate("create_question")}
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-6 col-sm-12 col-xs-12">
                      <div className="checkout-details">
                        <div className="order-box">
                          <div className="title-box">
                            <div>
                              {translate("product")}{" "}
                              <span> {translate("total")}</span>
                            </div>
                          </div>
                          <ul className="qty">
                            {cartItems.map((item, index) => {
                              return (
                                <li key={index}>
                                  {item.name} × {item.qty}{" "}
                                  <NumberFormat
                                    value={item.sum}
                                    displayType={"text"}
                                    thousandSeparator={true}
                                    prefix={"€"}
                                    renderText={(formattedValue) => (
                                      <span>{formattedValue}</span>
                                    )} // <--- Don't forget this!
                                  />
                                </li>
                              );
                            })}
                          </ul>
                          <ul className="sub-total">
                            <li>
                              {translate("subtotal")}
                              <span className="count">
                                <NumberFormat
                                  value={total}
                                  displayType={"text"}
                                  thousandSeparator={true}
                                  prefix={"€"}
                                  renderText={(formattedValue) => (
                                    <span>{formattedValue}</span>
                                  )} // <--- Don't forget this!
                                />
                              </span>
                            </li>
                            <li>
                              {translate("shipping")}
                              <div className="shipping">
                                <div className="shopping-option">
                                  <input
                                    type="checkbox"
                                    name="free-shipping"
                                    id="free-shipping"
                                  />
                                  <label htmlFor="free-shipping">
                                    {translate("free_shipping")}
                                  </label>
                                </div>
                                <div className="shopping-option">
                                  <input
                                    type="checkbox"
                                    name="local-pickup"
                                    id="local-pickup"
                                  />
                                  <label htmlFor="local-pickup">
                                    {translate("local_pickup")}
                                  </label>
                                </div>
                              </div>
                            </li>
                          </ul>

                          <ul className="total">
                            <li>
                              Total
                              <span className="count2">
                                <NumberFormat
                                  value={total}
                                  displayType={"text"}
                                  thousandSeparator={true}
                                  prefix={"€"}
                                  renderText={(formattedValue) => (
                                    <span>{formattedValue}</span>
                                  )} // <--- Don't forget this!
                                />
                              </span>
                            </li>
                          </ul>
                        </div>

                        <div className="payment-box">
                          <div className="upper-box">
                            <div className="payment-options">
                              <ul>
                                <li>
                                  <div className="radio-option stripe">
                                    <input
                                      type="radio"
                                      name="payment-group"
                                      id="payment-2"
                                      defaultChecked={true}
                                      onClick={() => this.checkhandle("stripe")}
                                    />
                                    <label htmlFor="payment-2">Stripe</label>
                                  </div>
                                </li>
                                <li>
                                  <div className="radio-option paypal">
                                    <input
                                      type="radio"
                                      name="payment-group"
                                      id="payment-1"
                                      defaultChecked={false}
                                      onClick={() => this.checkhandle("paypal")}
                                    />
                                    <label htmlFor="payment-1">
                                      PayPal
                                      <span className="image">
                                        <img
                                          src={`${
                                            process.env.PUBLIC_URL
                                          }/assets/images/paypal.png`}
                                          alt=""
                                        />
                                      </span>
                                    </label>
                                  </div>
                                </li>
                              </ul>
                            </div>
                          </div>
                          {total !== 0 ? (
                            <div className="text-right">
                              {this.state.payment === "stripe" ? (
                                <Elements>
                                  <CheckoutForm
                                    selectedProduct={cartItems}
                                    history={this.props.history}
                                    total={total}
                                    email={this.state.email}
                                    doOrder={this.doOrder}
                                    clientData={this.state}
                                    translate={translate}
                                  />
                                </Elements>
                              ) : (
                                <PaypalExpressBtn
                                  env={"sandbox"}
                                  client={client}
                                  currency={"USD"}
                                  total={total}
                                  onError={onError}
                                  onSuccess={onSuccess}
                                  onCancel={onCancel}
                                />
                              )}
                            </div>
                          ) : (
                            ""
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }
}
const mapStateToProps = (state) => ({
  ...state,
  cartItems: state.cartList.cart,
  symbol: state.data.symbol,
  total: getCartTotal(state.cartList.cart),
});

export default connect(
  mapStateToProps,
  {
    removeFromWishlist,
    placeOrder,
    clearCart,
    signup,
  }
)(withTranslate(checkOut));
