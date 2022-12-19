import Link from 'next/link';
import { useState, useEffect } from 'react';
import { listSearch } from '../../actions/brand';
import { getCookie, isAuth } from '../../actions/auth';
import { TRY } from '../../config';
import moment from 'moment';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faSearch
  } from "@fortawesome/free-solid-svg-icons";

const Search = () => {
    const [values, setValues] = useState({
        search: undefined,
        results: [],
        searched: false,
        message: ''
    });

    const { search, results, searched, message } = values;

    const searchSubmit = e => {
        e.preventDefault();
        listSearch({ search }).then(data => {
            setValues({ ...values, results: data, searched: true, message: `Brende të gjetura: ${data.length}` });
        });
    };

    const handleChange = e => {
        // console.log(e.target.value);
        setValues({ ...values, search: e.target.value, searched: false, results: [] });
    };

    const showUpdateButton = brand => {
        if (isAuth()) {
            return (
                <Link href={`/admin/brands/${brand.slug}`}>
                    <button className="Btn1 mr-3">PËRDITËSO</button>
                </Link>
            );
        } else if (isAuth()) {
            return (
                <Link href={`/admin/brands/${brand.slug}`}>
                    <button className="Btn1">PËRDITËSO</button>
                </Link>
            );
        }
    };

    const searchedBrands = (results = []) => {
        return (
    
            <div className="jumbotron jbrands">
                {message && <p className="pt-2 text-muted font-italic searchmsg">{message}</p>}

                {results.map((brand, i) => {
                    return (


                        <div className="divsearch divsearchbrand">
                            <div class="containerbrsearch" key={i}>
                            <div class="imagesearchbrand">
                            <Link href={`/brendet/${brand.slug}`}><img className="ImgBrandSearch" src={`${TRY}/${brand.logo}`} alt="" /></Link>
                            </div>
                            <div class="textbrand">
                                <p className="">{brand.name}</p>
                            </div>
                            </div>
                        {/* <div className="row" key={i}>
                        <div className="col-lg-6">
                        <img className="ImgBrandSearch" src={`${TRY}/${brand.logo}`} alt="" />
                        </div>
        
                        <div className="col-lg-1">
                        <p className="firstpar">{brand.name}</p>
        
                  
                        </div>
                        </div> */}
                        </div>
                    );
                })}
            </div>
    
        );
    };

    const searchForm = () => (
        <form onSubmit={searchSubmit}>
            {/* <div class="search-box">
                <button class="btn-search"><FontAwesomeIcon icon={faSearch} className="icons" style={{ fontSize: 20, color: "black"}}/></button>
                <input type="search" className="form-control input-search" placeholder="Kërkoni Brende..." onChange={handleChange}/>
            </div> */}
            <div className="row justify-content-center">
                <div className="col-md-3">
                    <input type="search" className="form-control searchbox" placeholder="Kërko Brende" onChange={handleChange}/>
                </div>
            </div>
        </form>
    );

    return (
        <div className="container-fluid ps-0">
            <div className="spacingSearchBG">{searchForm()}</div>
            {searched && <div style={{ marginTop: '-120px', marginBottom: '-80px' }}>{searchedBrands(results)}</div>}
        </div>
    );
};

export default Search;