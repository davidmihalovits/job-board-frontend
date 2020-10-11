import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Home.sass";
import axios from "axios";
import dayjs from "dayjs";
import arrow from "../../assets/arrow.svg";
import arrow2 from "../../assets/arrow2.svg";
import Job from "../job/Job";

const Home = () => {
    const [jobs, setJobs] = useState([]);
    const [search, setSearch] = useState("");
    const [locationFilter, setLocationFilter] = useState(false);
    const [location, setLocation] = useState("Everywhere");
    const [jobModal, setJobModal] = useState(false);
    const [job, setJob] = useState("");

    const url = useLocation();

    const getJobs = () => {
        axios
            .get("https://remotedev-server.herokuapp.com/getJobs")
            .then((res) => setJobs(res.data));
    };

    useEffect(() => {
        getJobs();

        if (url.pathname !== "/") {
            openJob(url.pathname.substring(1));
            setJob(url.pathname.substring(1));
        }
        // eslint-disable-next-line
    }, []);

    if (jobModal) {
        document.body.classList.add("modal-open");
    } else {
        document.body.classList.remove("modal-open");
    }

    const filteredJobs = jobs
        .filter(
            (job) =>
                job.title.toLowerCase().includes(search.toLowerCase()) ||
                job.description.toLowerCase().includes(search.toLowerCase())
        )
        .filter((job) => {
            if (location !== "Everywhere") {
                return job.location === location;
            }
            return job;
        });

    const openJob = (job) => {
        setJobModal(true);
        setJob(job.id);
    };

    return (
        <div className="home-container">
            <div className="home">
                <div className="search-filter">
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="home-search"
                        placeholder="Search..."
                    />
                    <div
                        className={
                            locationFilter ? "home-filter-open" : "home-filter"
                        }
                        onClick={() => setLocationFilter(!locationFilter)}
                    >
                        <p className="filter-button">{location}</p>
                        {!locationFilter && (
                            <img
                                src={arrow}
                                className="filter-arrow"
                                alt="arrow"
                            />
                        )}
                        {locationFilter && (
                            <img
                                src={arrow2}
                                className="filter-arrow"
                                alt="arrow"
                            />
                        )}
                    </div>
                </div>

                {locationFilter && (
                    <div className="filter-open-container">
                        <p
                            onClick={() => {
                                setLocation("Everywhere");
                                setLocationFilter(false);
                            }}
                        >
                            Everywhere
                        </p>
                        <p
                            onClick={() => {
                                setLocation("Worldwide");
                                setLocationFilter(false);
                            }}
                        >
                            Worldwide
                        </p>
                        <p
                            onClick={() => {
                                setLocation("North America");
                                setLocationFilter(false);
                            }}
                        >
                            North America
                        </p>
                        <p
                            onClick={() => {
                                setLocation("South America");
                                setLocationFilter(false);
                            }}
                        >
                            South America
                        </p>
                        <p
                            onClick={() => {
                                setLocation("Europe");
                                setLocationFilter(false);
                            }}
                        >
                            Europe
                        </p>
                        <p
                            onClick={() => {
                                setLocation("Africa");
                                setLocationFilter(false);
                            }}
                        >
                            Africa
                        </p>
                        <p
                            onClick={() => {
                                setLocation("Asia");
                                setLocationFilter(false);
                            }}
                        >
                            Asia
                        </p>
                        <p
                            onClick={() => {
                                setLocation("Oceania");
                                setLocationFilter(false);
                            }}
                        >
                            Oceania
                        </p>
                    </div>
                )}

                <p className="display-jobs-number">
                    Showing {filteredJobs.length} of {jobs.length}
                </p>

                {filteredJobs.map((job) => {
                    return (
                        <Link
                            className="job-link"
                            key={job.id}
                            to={`/${job.id}`}
                            onClick={() => openJob(job)}
                        >
                            <div className="job">
                                <div className="job-left">
                                    <img
                                        src={job.logo}
                                        className="job-logo"
                                        alt="logo"
                                    />
                                </div>
                                <div className="job-right">
                                    <p className="job-title">{job.title}</p>
                                    <p className="job-company">{job.company}</p>
                                    <div className="job-right-details">
                                        <p className="job-type">{job.type}</p>
                                        <p className="job-salary">
                                            {job.salary}
                                        </p>
                                        <p className="job-remote">
                                            100% Remote
                                        </p>
                                        <p className="job-location">
                                            {job.location}
                                        </p>
                                    </div>
                                    <p className="job-createdAt">
                                        {dayjs(job.createdAt).format(
                                            "DD/MM/YYYY"
                                        )}
                                    </p>
                                    <p style={{ display: "none" }}>
                                        {job.description}
                                    </p>
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>
            {jobModal && <Job id={job} setJobModal={setJobModal} />}
        </div>
    );
};

export default Home;
