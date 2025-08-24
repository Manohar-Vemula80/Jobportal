import { setSingleCompany } from '@/redux/companySlice'
import { COMPANY_API_END_POINT } from '@/utils/constant'
import axios from 'axios'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

const useGetCompanyById = (companyId) => {
    const dispatch = useDispatch();

    useEffect(() => {
        if (!companyId) {
            console.warn("⚠️ useGetCompanyById: No companyId provided, skipping request.");
            return;
        }

        const fetchSingleCompany = async () => {
            try {
                const res = await axios.get(`${COMPANY_API_END_POINT}/get/${companyId}`, { 
                    withCredentials: true 
                });

                console.log("✅ useGetCompanyById response:", res.data);

                // ✅ Check if company exists before dispatching
                if (!res.data?.company) {
                    console.warn(`⚠️ Company not found: ${companyId}`);
                    dispatch(setSingleCompany(null));
                    return;
                }

                if (res.data?.success) {
                    dispatch(setSingleCompany(res.data.company));
                }
            } catch (error) {
                const status = error?.response?.status;
                const message = error?.response?.data?.message;
                console.error(`❌ Error fetching company by ID (${companyId}) [${status}]: ${message || error.message}`);
            }
        };

        fetchSingleCompany();
    }, [companyId, dispatch]);
}

export default useGetCompanyById;
