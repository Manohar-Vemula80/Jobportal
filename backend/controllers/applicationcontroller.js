// controllers/applicationcontroller.js
import { Application } from '../models/applicationmodel.js';
import { Job } from '../models/jobmodel.js';

export const checkApplied = async (req, res) => {
    try {
        const userId = req.user?._id;
        const jobId = req.params.id;

        if (!jobId) {
            return res.status(400).json({ message: "Job ID is required", success: false });
        }

        const existingApplication = await Application.findOne({ job: jobId, applicant: userId });

        return res.status(200).json({
            success: true,
            alreadyApplied: !!existingApplication
        });
    } catch (error) {
        console.log('Error in checkApplied:', error);
        return res.status(500).json({ message: 'Server error', success: false });
    }
};

export const applyjob = async (req, res) => {
    try {
        // console.log('--- applyjob called ---');
        // console.log('req.user:', req.user && req.user._id ? String(req.user._id) : req.user);
        // console.log('req.params.id (jobId):', req.params.id);

        const userId = req.user?._id;
        const jobId = req.params.id;

        if (!jobId) {
            return res.status(400).json({ message: "Job ID is required", success: false });
        }

        // check if already applied
        const existingapplication = await Application.findOne({ job: jobId, applicant: userId });
        if (existingapplication) {
            // return non-error response indicating duplicate (so client won't get Axios exception)
            return res.status(200).json({
                success: true,
                alreadyApplied: true,
                message: "You have already applied for this job"
            });
        }

        // check job
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({ message: "Job not found", success: false });
        }

        // create application
        const application = await Application.create({
            job: jobId,
            applicant: userId,
        });

        job.applications.push(application._id);
        await job.save();

        return res.status(201).json({ message: "Application submitted successfully", success: true });
    } catch (error) {
        console.log("Error in applying for job:", error);
        return res.status(500).json({ message: "Server error", success: false });
    }
};



export const getAppliedJobs = async (req, res) => {
    try {
        const userId = req.id;
        const applications = await Application.find({ applicant: userId }).sort({ createdAt: -1 }).populate({
            path: 'job',
            options: { sort: { createdAt: -1 } },
            populate: {
                path: 'company',
                options: { sort: { createdAt: -1 } }
            }
        });
        if (!applications) {
            return res.status(404).json({ message: "No applications found", success: false });
        }
        return res.status(200).json({ applications, success: true });
    } catch (error) {
        console.log("Error in fetching applications:", error);
    }
}

//admin dekhega kitna user ne apply kiya hai
export const getApplicants = async (req, res) => {
    try {
        const jobId = req.params.id;
        const job = await Job.findById(jobId).populate({
            path: 'applications',
            options: { sort: { createdAt: -1 } },
            populate: {
                path: 'applicant',
            }
        });
        if (!job) {
            return res.status(404).json({ message: "Job not found", success: false });
        }
        return res.status(200).json({ job, success: true });
    } catch (error) {
        console.log("Error in fetching applicants:", error);
    }
}

export const updateStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const applicationId = req.params.id;
        if (!status) {
            return res.status(400).json({ message: "Status is required", success: false });
        }
        //find application by applicationId
        const application = await Application.findById(applicationId);
        if (!application) {
            return res.status(404).json({ message: "Application not found", success: false });
        }
        //update status
        application.status = status.toLowerCase();
        await application.save();
        return res.status(200).json({ message: "Application status updated successfully", success: true });
    } catch (error) {
        console.log("Error in updating application status:", error);
    }
}