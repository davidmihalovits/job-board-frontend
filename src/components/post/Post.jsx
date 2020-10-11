import React, { useState, useEffect } from "react";
import "./Post.sass";
import { Link } from "react-router-dom";
import back from "../../assets/back.svg";
import arrow from "../../assets/arrow.svg";
import arrow2 from "../../assets/arrow2.svg";
import { storage } from "../../firebase";
import axios from "axios";

// stripe
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "../checkoutForm/CheckoutForm";
const promise = loadStripe(
    "pk_test_51HaBm7J45vzt64iQ2q6CnJ1NgICu5lEF1lE9GLAE2MmNici48fV718skNpAEslUIXVkx9xq1RYaSRpwt168BehiF00ZEtZlytw"
);

const Post = () => {
    const [title, setTitle] = useState("");
    const [type, setType] = useState("Full-Time");
    const [location, setLocation] = useState("Worldwide");
    const [chooseLocation, setChooseLocation] = useState(false);
    const [salary, setSalary] = useState("");
    const [description, setDescription] = useState("");
    const [company, setCompany] = useState("");
    const [website, setWebsite] = useState("");
    const [logoUrl, setLogoUrl] = useState("");
    const [about, setAbout] = useState("");
    const [email, setEmail] = useState("");

    const fieldLength =
        title.length > 0 &&
        salary.length > 0 &&
        description.length > 0 &&
        company.length > 0 &&
        website.length > 0 &&
        logoUrl.length > 0 &&
        about.length > 0 &&
        email.length > 0;

    useEffect(() => {
        document.body.classList.remove("modal-open");
        // eslint-disable-next-line
    }, []);

    const postJob = async () => {
        await axios.post("https://remotedev-server.herokuapp.com/addJob", {
            title: title,
            type: type,
            salary: salary,
            location: location,
            description: description,
            company: company,
            website: website,
            logo: logoUrl,
            about: about,
            email: email,
        });
    };

    const logoOnChange = (e) => {
        const logo = e.target.files[0];
        const uploadTask = storage.ref(`logo/${logo.name}`).put(logo);
        uploadTask.on(
            "state_changed",
            (snapshot) => {},
            (error) => {
                console.log(error);
            },
            () => {
                storage
                    .ref("logo")
                    .child(logo.name)
                    .getDownloadURL()
                    .then((url) => {
                        setLogoUrl(url);
                    });
            }
        );
    };

    return (
        <div className="post-container">
            <Link to="/" className="post-back-link">
                <img src={back} className="post-back-button" alt="back" />
            </Link>
            <form className="post-form">
                <label className="post-label" htmlFor="title">
                    Job Title
                </label>
                <input
                    onChange={(e) => setTitle(e.target.value)}
                    value={title}
                    type="text"
                    name="title"
                    id="title"
                    className="post-input"
                />
                <label className="post-label" htmlFor="type">
                    Job Type
                </label>
                <div className="types-container">
                    <div
                        onClick={() => setType("Full-Time")}
                        className={`${
                            type === "Full-Time"
                                ? `type-selected`
                                : `type-not-selected`
                        }`}
                        name="type"
                        id="type"
                    >
                        Full-Time
                    </div>
                    <div
                        onClick={() => setType("Part-Time")}
                        className={`${
                            type === "Part-Time"
                                ? `type-selected`
                                : `type-not-selected`
                        }`}
                        name="type"
                        id="type"
                    >
                        Part-Time
                    </div>
                    <div
                        onClick={() => setType("Contract")}
                        className={`${
                            type === "Contract"
                                ? `type-selected`
                                : `type-not-selected`
                        }`}
                        name="type"
                        id="type"
                    >
                        Contract
                    </div>
                </div>
                <label className="post-label" htmlFor="location">
                    Location (100% Remote)
                </label>
                <p
                    className={
                        chooseLocation
                            ? "choose-location-open"
                            : "choose-location"
                    }
                    onClick={() => setChooseLocation(!chooseLocation)}
                    name="location"
                    id="location"
                >
                    {location}
                    {!chooseLocation && (
                        <img
                            src={arrow}
                            className="location-arrow"
                            alt="arrow"
                        />
                    )}
                    {chooseLocation && (
                        <img
                            src={arrow2}
                            className="location-arrow"
                            alt="arrow"
                        />
                    )}
                </p>
                {chooseLocation && (
                    <div className="choose-location-open-container">
                        <p
                            onClick={() => {
                                setLocation("Worldwide");
                                setChooseLocation(false);
                            }}
                        >
                            Worldwide
                        </p>
                        <p
                            onClick={() => {
                                setLocation("North America");
                                setChooseLocation(false);
                            }}
                        >
                            North America
                        </p>
                        <p
                            onClick={() => {
                                setLocation("South America");
                                setChooseLocation(false);
                            }}
                        >
                            South America
                        </p>
                        <p
                            onClick={() => {
                                setLocation("Europe");
                                setChooseLocation(false);
                            }}
                        >
                            Europe
                        </p>
                        <p
                            onClick={() => {
                                setLocation("Africa");
                                setChooseLocation(false);
                            }}
                        >
                            Africa
                        </p>
                        <p
                            onClick={() => {
                                setLocation("Asia");
                                setChooseLocation(false);
                            }}
                        >
                            Asia
                        </p>
                        <p
                            onClick={() => {
                                setLocation("Oceania");
                                setChooseLocation(false);
                            }}
                        >
                            Oceania
                        </p>
                    </div>
                )}
                <label className="post-label" htmlFor="salary">
                    Annual Salary (USD)
                </label>
                <p
                    style={{
                        fontSize: "14px",
                        fontWeight: "300",
                        color: "#b1b1b1",
                    }}
                >
                    For example: $45,000 - $81,000
                </p>
                <input
                    onChange={(e) => setSalary(e.target.value)}
                    value={salary}
                    type="text"
                    name="salary"
                    id="salary"
                    className="post-input"
                />
                <label className="post-label" htmlFor="description">
                    Job Description
                </label>
                <div className="description-length-container">
                    <textarea
                        onChange={(e) => setDescription(e.target.value)}
                        value={description}
                        type="text"
                        name="description"
                        id="description"
                        className="post-textarea"
                        maxLength="3000"
                    />
                    <p className="description-length">
                        {description.length} / 3000
                    </p>
                </div>
                <label className="post-label" htmlFor="company">
                    Company Name
                </label>
                <input
                    onChange={(e) => setCompany(e.target.value)}
                    value={company}
                    type="text"
                    name="company"
                    id="company"
                    className="post-input"
                />
                <label className="post-label" htmlFor="website">
                    Company Website
                </label>
                <input
                    onChange={(e) => setWebsite(e.target.value)}
                    value={website}
                    type="text"
                    name="website"
                    id="website"
                    className="post-input"
                />
                <label className="post-label">Company Logo</label>
                <input
                    style={{ display: "none" }}
                    name="logo"
                    id="logo"
                    type="file"
                    accept=".jpg, .png, .jpeg, .svg"
                    value={""}
                    onChange={logoOnChange}
                />
                <label className="logo-label" htmlFor="logo">
                    {logoUrl ? (
                        <img className="logo-image" src={logoUrl} alt="logo" />
                    ) : (
                        "Click to upload logo"
                    )}
                </label>
                <label className="post-label" htmlFor="about">
                    Company Description
                </label>
                <div className="description-length-container">
                    <textarea
                        onChange={(e) => setAbout(e.target.value)}
                        value={about}
                        type="text"
                        name="about"
                        id="about"
                        className="post-textarea"
                        maxLength="3000"
                    />
                    <p className="description-length">{about.length} / 3000</p>
                </div>
                <label className="post-label" htmlFor="email">
                    Company Email
                </label>
                <input
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                    type="email"
                    name="email"
                    id="email"
                    className="post-input"
                />
                <hr className="post-line" />
                <h2 className="preview-job-title">Preview</h2>
                <div className="preview-job-container">
                    <div className="preview-job-left">
                        {logoUrl ? (
                            <img
                                src={logoUrl}
                                className="job-logo-preview"
                                alt="logo"
                            />
                        ) : null}
                    </div>
                    <div className="preview-job-right">
                        <p className="job-title-preview">{title}</p>
                        <p className="job-company-preview">{company}</p>
                        <div className="job-right-details-preview">
                            <p className="job-type-preview">{type}</p>
                            <p className="job-salary-preview">{salary}</p>
                            <p className="job-remote-preview">100% Remote</p>
                            <p className="job-location-preview">{location}</p>
                        </div>
                    </div>
                </div>
                <hr className="post-line" />
                <h2 className="payment-title">Payment</h2>
            </form>
            <Elements stripe={promise}>
                <CheckoutForm postJob={postJob} fieldLength={fieldLength} />
            </Elements>
        </div>
    );
};

export default Post;
