//server/src/controllers/course.controller.ts

import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import Course from '../models/course.model';
import Module from '../models/module.model';
import Assignment from '../models/assignment.model';

// @desc    Create a new course
// @route   POST /api/courses
// @access  Private
export const createCourse = asyncHandler(async (req: Request, res: Response) => {
    const { title, instructor, description, status } = req.body;

    if (!req.user) {
        res.status(401);
        throw new Error('User not found');
    }

    const course = await Course.create({
        title,
        instructor,
        description,
        status,
        user: req.user._id,
    });

    res.status(201).json(course);
});

// @desc    Get all courses for logged-in user
// @route   GET /api/courses
// @access  Private
export const getCourses = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
        res.status(401);
        throw new Error('User not found');
    }

    const courses = await Course.find({ user: req.user._id }).sort({
        createdAt: -1,
    });

    res.status(200).json(courses);
});

// get single course by id
// @desc    Get a single course by ID
// @route   GET /api/courses/:id

export const getCourseById = asyncHandler(
  async (req: Request, res: Response) => {
    const course = await Course.findById(req.params.id);

    if (!course) {
      res.status(404);
      throw new Error('Course not found');
    }

    if (course.user.toString() !== req.user?._id.toString()) {
      res.status(401);
      throw new Error('User not authorized to access this course');
    }

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

    if (course.user.toString() !== req.user?._id.toString()) {
        res.status(401);
        throw new Error('User not authorized to update this course');
    }

    const updateCourse = await Course.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
            new: true,
            runValidators: true,
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
    const course = await Course.findById(req.params.id);

    if (!course) {
      res.status(404);
      throw new Error('Course not found');
    }

    if (course.user.toString() !== req.user?._id.toString()) {
      res.status(401);
      throw new Error('User not authorized to delete this course');
    }


    const modules = await Module.find({ 
      course: req.params.id, 
      user: req.user._id 
    });

    const moduleIds = modules.map(m => m._id);

    await Assignment.deleteMany({ 
      module: { $in: moduleIds }, 
      user: req.user._id 
    });

    await Module.deleteMany({ 
      _id: { $in: moduleIds }, 
      user: req.user._id 
    });

    await Course.findByIdAndDelete(req.params.id);

    // ------------------------------------

    res.status(200).json({
      message: 'Course, modules, and assignments deleted successfully',
      id: req.params.id,
    });
  }
);
