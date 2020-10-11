import React, { useState, useEffect } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import "./CheckoutForm.sass";

const CheckoutForm = (props) => {
    const [succeeded, setSucceeded] = useState(false);
    const [error, setError] = useState(null);
    const [processing, setProcessing] = useState("");
    const [disabled, setDisabled] = useState(true);
    const [clientSecret, setClientSecret] = useState("");

    const stripe = useStripe();
    const elements = useElements();

    useEffect(() => {
        window
            .fetch(
                "https://remotedev-server.herokuapp.com/create-payment-intent",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ items: [{ id: "job" }] }),
                }
            )
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                setClientSecret(data.clientSecret);
            });
    }, []);

    const handleChange = async (event) => {
        setDisabled(event.empty);
        setError(event.error ? event.error.message : "");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setProcessing(true);

        const payload = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: elements.getElement(CardElement),
            },
        });

        if (payload.error) {
            setError(`Payment failed: ${payload.error.message}`);
            setProcessing(false);
        } else {
            setError(null);
            setProcessing(false);
            setSucceeded(true);
            props.postJob();
        }
    };

    return (
        <form onSubmit={handleSubmit} className="stripe-form">
            <p className="stripe-info">
                We use Stripe for secure payments. This is just for testing
                purposes. Please use card number 4242 4242 4242 4242, any expiry
                date in the future, any CVC and any postal code number.
            </p>

            <CardElement
                options={{
                    style: {
                        base: {
                            fontSize: "20px",
                            color: "#A128DA",
                            "::placeholder": {
                                color: "#b1b1b1",
                            },
                        },
                    },
                }}
                onChange={handleChange}
            />

            {error && <p className="stripe-error">{error}</p>}

            <button
                className="stripe-button"
                disabled={
                    processing || disabled || succeeded || !props.fieldLength
                }
            >
                {processing ? "Loading..." : "Post Job - $99"}
            </button>

            {succeeded && (
                <p className="job-posted">Job posted successfully!</p>
            )}
        </form>
    );
};

export default CheckoutForm;
