import React, { useEffect, useState, useRef } from "react";
import ReactDOM from "react-dom";
import { useHistory } from "react-router-dom";
import "./Job.sass";
import axios from "axios";
import close from "../../assets/close.svg";
import dayjs from "dayjs";
import { storage } from "../../firebase";

const Job = (props) => {
    const [job, setJob] = useState({});
    const [applyModal, setApplyModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [resumeName, setResumeName] = useState("");
    const [resumeUrl, setResumeUrl] = useState("");
    const [successMessage, setSuccessMessage] = useState(false);

    const history = useHistory();

    const getJob = () => {
        axios
            .get(`https://remotedev-server.herokuapp.com/getJob/${props.id}`)
            .then((res) => setJob(res.data));
    };

    useEffect(() => {
        getJob();
        // eslint-disable-next-line
    }, [props]);

    const closeButton = () => {
        props.setJobModal(false);
        history.push("/");
    };

    const closeButton2 = () => {
        setResumeName("");
        setResumeUrl("");
        setApplyModal(false);
        setSuccessMessage(false);
    };

    useEffect(() => {
        ReactDOM.render(
            <React.StrictMode>{applyModal && applyModalOpen}</React.StrictMode>,
            document.getElementById("modal")
        );
        // eslint-disable-next-line
    }, [applyModal, resumeName, successMessage, loading]);

    if (applyModal) {
        document.getElementById("root").style.opacity = "0.1";
        document.getElementById("root").style.pointerEvents = "none";
    } else {
        document.getElementById("root").style.opacity = "1";
        document.getElementById("root").style.pointerEvents = "auto";
    }

    const useOnClick = (ref, handler) => {
        useEffect(() => {
            const listener = (event) => {
                if (!ref.current || ref.current.contains(event.target)) {
                    return;
                }
                handler(event);
            };
            document.addEventListener("mousedown", listener);
            return () => {
                document.removeEventListener("mousedown", listener);
            };
            // eslint-disable-next-line
        }, []);
    };
    const ref = useRef();
    useOnClick(ref, () => {
        setResumeName("");
        setResumeUrl("");
        setSuccessMessage(false);
        setApplyModal(false);
    });

    const resumeOnChange = (e) => {
        const resume = e.target.files[0];
        const uploadTask = storage.ref(`resume/${resume.name}`).put(resume);
        uploadTask.on(
            "state_changed",
            (snapshot) => {},
            (error) => {
                console.log(error);
            },
            () => {
                storage
                    .ref("resume")
                    .child(resume.name)
                    .getDownloadURL()
                    .then((url) => {
                        setResumeUrl(url);
                        setResumeName(resume.name);
                    });
            }
        );
    };

    const submitApplication = async () => {
        setLoading(true);

        await axios
            .post("https://remotedev-server.herokuapp.com/submit", {
                company: job.company,
                title: job.title,
                resumeUrl: resumeUrl,
                email: job.email,
            })
            .then((res) => {
                if (res.data.status === "Application sent.") {
                    setLoading(false);
                    setResumeName("");
                    setResumeUrl("");
                    setSuccessMessage(true);
                } else {
                    alert("There was an error sending the application.");
                    setLoading(false);
                }
            });
    };

    const applyModalOpen = (
        <div ref={ref} className="job-apply-modal">
            <div className="close-button2-container">
                <img
                    onClick={closeButton2}
                    src={close}
                    alt="close"
                    className="close-button2"
                />
            </div>
            <h2 className="job-apply-modal-title">
                Apply to {job.company} as a {job.title}
            </h2>
            <hr className="line" />
            <p className="job-apply-modal-resume">Resume</p>
            <input
                style={{ display: "none" }}
                name="resume"
                id="resume"
                type="file"
                accept=".pdf"
                value={""}
                onChange={resumeOnChange}
            />
            <label className="resume-label" htmlFor="resume">
                Upload Resume (PDF)
            </label>
            <p className="resume-name">
                {!resumeName ? (
                    "No resume uploaded"
                ) : (
                    <a
                        rel="noopener noreferrer"
                        target="_blank"
                        href={resumeUrl}
                        style={{ color: "black" }}
                    >
                        {resumeName}
                    </a>
                )}
            </p>
            <button
                disabled={!resumeName || loading}
                className="submit-button"
                onClick={submitApplication}
            >
                {loading ? "Loading..." : "Submit Application"}
            </button>
            {successMessage && <p>Application sent!</p>}
        </div>
    );

    return (
        <div className="job-container">
            <img
                onClick={closeButton}
                src={close}
                alt="close"
                className="close-button"
            />
            <div className="job-top-container">
                <div className="job-top">
                    <div className="job-top-left">
                        <img
                            src={job.logo}
                            alt="logo"
                            className="job-top-logo"
                        />
                    </div>
                    <div className="job-top-right">
                        <p className="job-top-title">{job.title}</p>
                        <p className="job-top-company">{job.company}</p>
                        <p className="job-top-created">
                            {dayjs(job.createdAt).format("DD/MM/YYYY")}
                        </p>
                    </div>
                </div>
                <div className="job-top-buttons">
                    <a
                        className="job-top-website-link"
                        href={`https://${job.website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <button className="job-top-website">Website</button>
                    </a>
                    <button
                        className="job-top-apply"
                        onClick={() => setApplyModal(true)}
                    >
                        Apply
                    </button>
                </div>
            </div>
            <div className="job-details-container">
                <h2 className="job-details-title">Details</h2>
                <div className="job-details">
                    <p className="job-detail-type">{job.type}</p>
                    <p className="job-detail-salary">{job.salary}</p>
                    <p className="job-detail-remote">100% Remote</p>
                    <p className="job-detail-location">{job.location}</p>
                </div>
                <h2 className="job-details-title">Description</h2>
                <p className="job-detail-description">{job.description}</p>
                <h2 className="job-details-title">About {job.company}</h2>
                <p className="job-detail-about">{job.about}</p>
            </div>
        </div>
    );
};

export default Job;
