//server/src/controllers/course.controller.ts

import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import Course from '../models/course.model';

// @desc    Create a new course
// @route   POST /api/courses
// @access  Private
export const createCourse = asyncHandler(async (req: Request, res: response) => {
    const { title, instructor, description, status } = req.body;

    //get req.user from protect middleware

    if (!req.user) {
        res.status(401);
        throw new Error('User not found');
    }

    const course = await Course.create({
        title,
        instructor,
        description,
        status,
        user: req.user._id, // Associate course with logged-in user
    });

    res.status(201).json(course); // 201 - Created
});

// @desc    Get all courses for logged-in user
// @route   GET /api/courses
// @access  Private
export const getCourses = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
        res.status(401);
        throw new Error('User not found');
    }

    // find courses by user
    const courses = await Course.find({ user: req.user._id }).sort({
        createdAt: -1, // Sort by creation date descending
    });

    res.status(200).json(courses);
});

// get single course by id
// @desc    Get a single course by ID
// @route   GET /api/courses/:id

export const getCourseById = asyncHandler(
  async (req: Request, res: Response) => {
    // find course by id
    const course = await Course.findById(req.params.id);

    // check if course exists
    if (!course) {
      res.status(404); // 404 - Not Found
      throw new Error('Course not found');
    }

    // Check if user is authorized to access the course
    if (course.user.toString() !== req.user?._id.toString()) {
      res.status(401); // 401 - Unauthorized
      throw new Error('User not authorized to access this course');
    }

    // send course data
    res.status(200).json(course);
  }
);

// @desc    Update a course
// @route   PUT /api/courses/:id
// @access  Private
export const updateCourse = asyncHandler(
  async (req: Request, res: Response) => {
    const course = await Course.findById(req.params.id);

    if(!course) {
        res.status(404);
        throw new Error('Course not found');
    }

    //check if user is authorized to update the course
    if (course.user.toString() !== req.user?._id.toString()) {
        res.status(401);
        throw new Error('User not authorized to update this course');
    }

    //update course fields
    const updateCourse = await Course.findByIdAndUpdate(
        req.params.id,
        req.body, //fields to update
        {
            new: true, //return the updated document
            runValidators: true, //run validators on update
        }
    );

    res.status(200).json(updateCourse);
  }
);

// @desc    Delete a course
// @route   DELETE /api/courses/:id
// @access  Private

export const deleteCourse = asyncHandler(
    async (req: Request, res: Response) => {

        //find course by id
        const course = await Course.findById(req.params.id);

        //check if course exists
        if (!course) {
            res.status(404);
            throw new Error('Course not found');
        }

        //check if user is authorized to delete the course
        if (course.user.toString() !== req.user?._id.toString()) {
            res.status(401);
            throw new Error('User not authorized to delete this course');
        }
        
        //delete course
        await Course.findByIdAndDelete(req.params.id);

        res.status(200).json({
            message: 'Course deleted successfully',
            id: req.params.id,
        });
    }
);
