import React, { useState } from "react";

// import { Label } from "../ui/label";
// import { Input } from "../ui/input";
// import { Button } from "../ui/button";
import Navbar from "@/components/shared/Navbar";
import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { COMPANY_API_END_POINT } from "@/utils/constant";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { setSingleCompany } from "@/redux/companySlice";


const CompanyCreate = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [companyName, setCompanyName] = useState(""); // initialize to empty string
    const [loading, setLoading] = useState(false);

    const registerNewCompany = async () => {
  if (!companyName?.trim()) {
    toast.error("Please enter a company name");
    return;
  }

  // OPTIONAL: quick client-side auth check (if you keep user in redux)
  // const { user } = useSelector(store => store.auth);
  // if (!user) { toast.error("Please login first"); navigate('/login'); return; }

  setLoading(true);
  try {
    console.log("Calling register:", COMPANY_API_END_POINT + "/register", { companyName });
    const res = await axios.post(
      `${COMPANY_API_END_POINT}/register`,
      { companyName },
      {
        headers: { "Content-Type": "application/json" },
        withCredentials: true, // required to send cookies if backend uses them
      }
    );

    console.log("Register response:", res);
    if (res?.data?.success) {
      dispatch(setSingleCompany(res.data.company));
      toast.success(res.data.message || "Company created");
      const companyId = res?.data?.company?._id;
      navigate(companyId ? `/admin/companies/${companyId}` : '/admin/companies');
    } else {
      // server returned 200 but success false
      toast.error(res?.data?.message || "Failed to create company");
    }
  } catch (err) {
    console.error("Register error full:", err);
    // show best error message available
    const serverMsg = err.response?.data?.message;
    const status = err.response?.status;
    toast.error(serverMsg || `Error (${status || "network"}). Check console/network tab`);
    // print full network response body for debugging
  
  console.log('--- registerCompany called ---');
  console.log('req.method, req.path:', req.method, req.path);
  console.log('req.headers.cookie:', req.headers.cookie);
  console.log('req.body:', req.body);
    setLoading(false);
  }
}


  return (
    <div>
      <Navbar />
      <div className="max-w-4xl mx-auto">
        <div className="my-10">
          <h1 className="font-bold text-2xl">Your Company Name</h1>
          <p className="text-gray-500">
            What would you like to give your company name? You can change this later.
          </p>
        </div>

        <Label>Company Name</Label>
        <Input
          type="text"
          className="my-2"
          placeholder="JobHunt, Microsoft etc."
          value={companyName}
          onChange={(e)=> setCompanyName(e.target.value)}
        />

        <div className="flex items-center gap-2 my-10">
          <Button variant="outline" onClick={()=>navigate('/admin/companies')}>Cancel</Button>
          <Button onClick={registerNewCompany} disabled={loading}>
            {loading ? "Creating..." : "Continue"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CompanyCreate;
