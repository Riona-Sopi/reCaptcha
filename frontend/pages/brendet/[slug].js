import Link from "next/link";
import { API, TRY } from "../../config";
import MainLayout from "../../components/MainLayout";
import { Parser } from "html-to-react";
import { Main } from "next/document";
import { useEffect, useState } from "react";

export default function Brand({ brand }) {
  const [langType, setLangType] = useState(0);

  useEffect(() => {
    const localLangType = localStorage.getItem("lang");
    if (localLangType) {
      setLangType(localLangType);
    }
  }, []);

  const showBrand = () => {
    return (
      <>
        <p className="headerTitle">BRENDET</p>
        <div className="wholeinfoBrand">
          <div className="space" style={{ marginBottom: "10em" }}></div>
          <div className="row mt-5">
            <div className="col-lg-6 col-6 col-md-6 infoSpace">
              <div className="infBrand container">
                <div className="row">
                  <div className="col-lg-6 col-6 col-md-6">
                    <p className="info">Info:</p>
                  </div>
                  <div className="col-lg-6 col-6 col-md-6">
                    <p className="infbrend">
                      {Parser().parse(
                        langType == 0 ? brand.info : brand.info_en
                      )}
                    </p>
                  </div>
                </div>
              </div>
              <div className="infBrand">
                <div className="row">
                  <div className="col-lg-6 col-6 col-md-6">
                    <p className="address">Adresa:</p>
                  </div>
                  <div className="col-lg-6 col-6 col-md-6">
                    <p className="infbrend">{brand.address}</p>
                  </div>
                </div>
              </div>
              <div className="infBrand">
                <div className="row">
                  <div className="col-lg-6 col-6">
                    <p className="info">Tel:</p>
                  </div>
                  <div className="col-lg-6 col-6">
                    <p className="infbrend">{brand.phone}</p>
                  </div>
                </div>
              </div>
              <div className="infBrand">
                <div className="row">
                  <div className="col-lg-6 col-6">
                    <p className="info">Email:</p>
                  </div>
                  <div className="col-lg-6 col-6">
                    <p className="infbrend">{brand.email}</p>
                  </div>
                </div>
              </div>
              <div className="brandBtn"></div>
            </div>
          </div>
        </div>
      </>
    );
    //  });
  };

  return (
    <MainLayout setLangType={setLangType} langType={langType}>
      {showBrand()}
    </MainLayout>
  );
}

export async function getServerSideProps({ params }) {
  const res = await fetch(`${API}/brand/${params.slug}`);
  const data = await res.json();

  return {
    props: { brand: data },
  };
}
