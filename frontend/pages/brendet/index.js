import Link from 'next/link';
import { API, TRY } from '../../config';
import MainLayout from '../../components/MainLayout';
import React, { useState, useEffect } from 'react';
import { allList } from '../../actions/brand';
import Loading from '../../components/loading';
import ReactPaginate from 'react-paginate';
import Router, { withRouter } from 'next/router'
import Search from './search';
import axios from "axios";

const getBrandsAutocomplete = async (str) => {
    try {
      let searchableBrand = str.replace(/,/g, "");
      let url = `${API}/brands/autocomplete?name=` + searchableBrand;
  
      let { data } = await axios.get(url);
      return data;
    } catch (error) {
      console.error(error);
    }
};



const Brendet = (props) => {

     const [optionsOne, setOptionsOne] = useState([]);
     const [value, setValue] = useState("");

     const onChangeOne = async (e) => {
        if (e.target.value) {
          let data = await getBrandsAutocomplete(e.target.value);
          setOptionsOne(data);
        }
      };


     const usersPerPage = 3;


     const [pageCount, setPageCount] = useState(1);
     const [isLoading, setIsLoading] = useState(false);
 

     useEffect(() => {
          loadBrands();
      }, []);

      const [langType, setLangType] = useState(0);
      useEffect(() => {
        const localLangType = localStorage.getItem("lang");
        if (localLangType) {
          setLangType(localLangType);
        }
      }, []);
    


     const loadBrands = () => {
          allList().then(data => {
              if (data.error) {
                  console.log(data.error);
              } else {
                   const _pageCount = Math.ceil(data.results.length / usersPerPage);
                  setPageCount(_pageCount);
              }
          });
      };



      const pagginationHandler = (page) => {
          const currentPath = props.router.pathname;
          const currentQuery = props.router.query;
          currentQuery.page = page.selected + 1;
  
          props.router.push({
              pathname: currentPath,
              query: currentQuery,
          });
  
      };
    

     const showBrands = () => {
          return props.brands.map((brand, i) => {
              return (
                    <div className='col-lg-4 col-md-4 col-6' key={i}>
                         <Link href={`/brendet/${brand.slug}`}><img className="brandimgg" src={`${TRY}/${brand.logo}`} width="100%"/></Link>
                    </div>
              );
           });
      };


  return (
     <MainLayout setLangType={setLangType} langType={langType}>
        <div className='globalSpace'>
          <div>
               <p className="headerTitle">{langType == 0 ? "BRENDET" : "BRANDS"}</p>
               </div>
               <div className='BrandsSpace'>
               <div className="searchcontainer" style={{margin:"auto"}}>
                    <div className="" style={{color: "black", marginBottom:"200px"}}>
                        <Search/> 
        
                    </div> 
                </div>
               <div className='row g-0'>
               {isLoading ? 
                    <Loading message="Loading..."  showMessage={true} visible={true} contentColorClass='text-gray-600' showSpinner={true} />
                    :
                    showBrands()
                }
                </div>

                <div className="paginationClient">
            <ReactPaginate
                previousLabel="<"
                nextLabel=">"
                pageCount={pageCount}
                onPageChange={pagginationHandler}
                containerClassName={"paginationBttns"}
                previousLinkClassName={"previousBttn"}
                nextLinkClassName={"nextBttn"}
                disabledClassName={"paginationDisabled"}
                activeClassName={"paginationActive"}
            />
            </div>
           </div>
            </div> 
     </MainLayout> 
  )}


  export async function getServerSideProps({query}){
    
     const page = query.page || 1; 
     const limit = 3;

     const res = await fetch(`${API}/brands?page=${page}&limit=${limit}`)

     const data = await res.json()
   
     return {
         props: { brands: data.results }
     }
 
   };

   export default withRouter(Brendet);