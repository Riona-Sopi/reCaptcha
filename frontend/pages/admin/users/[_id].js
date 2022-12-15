import Layout from '../../../components/Layout';
import Admin from '../../../components/auth/Admin';
import UserUpdate from '../../../components/auth/UserUpdate';

const User = () => {
    return (
        <Layout>
           <div className="addform">
             <div className="row no-gutters">
                <div className="col-lg-6">
                    <p className="maintitle">PËRDORUESIT / PËRDITËSO PËRDORUESIN</p>
                </div>
                {/* <div className="col-lg-6">
                  <button className="addbtn">Shto nje brend</button>
                </div> */}
             </div>
            </div>      
            <UserUpdate/>
        </Layout>
    );
};

export default User;