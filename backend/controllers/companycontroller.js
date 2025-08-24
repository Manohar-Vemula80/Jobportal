import { Company } from "../models/companymodel.js";
import cloudinary from "../utils/cloudinary.js";
import getDataUri from "../utils/datauri.js";


export const registerCompany = async (req, res) => {
    try {
        const {companyName}= req.body;
        const userId = req.user?._id || req.id;
        if (!companyName) {
            return res.status(400).json({ message: "Company name is required", success: false });
        }
        let company = await Company.findOne({ name: companyName });
        if (company) {
            return res.status(400).json({ message: "Company already exists", success: false });
        }
        company = await Company.create({ name: companyName , userId: req.id });
        res.status(201).json({ message: "Company registered successfully", company,success: true });

    } catch (error) {
        console.log("Error in company registration:", error);
    }
}

export const getCompany = async (req, res) => {
    try {
         const userId = req.id;
        const companies = await Company.find({ userId });
        if(!companies){
            return res.status(404).json({ message: "No companies found", success: false });
        }
        return res.status(200).json({ companies, success: true });
    } catch (error) {
        console.log("Error in fetching companies:", error);
        
    }
}

export const getCompanyById = async (req, res) => {
    try {
        const companyId = req.params.id;
        const company = await Company.findById(companyId);
        if(!company){
            return res.status(404).json({ message: "Company not found", success: false });
        }
        return res.status(200).json({ company, success: true });
    } catch (error) {
        console.log("Error in fetching company by ID:", error);
        
    }
}

export const updateCompany = async (req, res) => {
    try {
        const {name, description, location, website} = req.body;
        const file = req.file;
         // idhar cloudinary ayega
        const fileUri = getDataUri(file);
        const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
        const logo = cloudResponse.secure_url;
    
        const updateCompany={name, description, location, website,logo};

        const company = await Company.findByIdAndUpdate(req.params.id, updateCompany, { new: true });

        if (!company) {
            return res.status(404).json({ message: "Company not found", success: false });
        }
        return res.status(200).json({ message: "Company updated successfully", company, success: true });
        } catch (error) {
        console.log("Error in updating company:", error);
    }
}