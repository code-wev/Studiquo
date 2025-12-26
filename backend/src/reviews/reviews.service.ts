import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Booking } from 'src/models/Booking.model';
import { BookingStudents } from 'src/models/BookingStudents.model';
import { TimeSlot } from 'src/models/TimeSlot.model';
import { TutorAvailability } from 'src/models/TutorAvailability.model';
import { Review } from '../models/Review.model';
import { CreateReviewDto } from './dto/review.dto';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectModel(Review.name) private readonly reviewModel: Model<Review>,
    @InjectModel(Booking.name) private readonly bookingModel: Model<Booking>,
    @InjectModel(BookingStudents.name)
    private readonly bookingStudentsModel: Model<BookingStudents>,
    @InjectModel(TimeSlot.name) private readonly timeSlotModel: Model<TimeSlot>,
    @InjectModel(TutorAvailability.name)
    private readonly availabilityModel: Model<TutorAvailability>,
  ) {}

  /**
   * Submit a review for a completed booking.
   *
   * @param user - The authenticated user submitting the review
   * @param dto - The review data transfer object
   * @returns The created review
   */
  async submitReview(user: any, dto: CreateReviewDto): Promise<Review> {
    const bookingId = new Types.ObjectId(dto.booking);
    const studentId = new Types.ObjectId(user.userId);
    const tutorId = new Types.ObjectId(dto.tutor);

    // 1. Booking must exist and be completed
    const booking = await this.bookingModel.findOne({
      _id: bookingId,
      status: 'COMPLETED',
    });

    if (!booking) {
      throw new BadRequestException('Booking not found or not completed');
    }

    // 2. Booking must belong to the student
    const isStudentBooking = await this.bookingStudentsModel.exists({
      booking: bookingId,
      student: studentId,
    });

    if (!isStudentBooking) {
      throw new ForbiddenException(
        'You are not authorized to review this booking',
      );
    }

    // 3. Slot must exist and must have ended
    const slot = await this.timeSlotModel.findById(booking.timeSlot, {
      endTime: 1,
    });

    if (!slot) {
      throw new BadRequestException('Time slot not found');
    }

    if (slot.endTime > new Date()) {
      throw new BadRequestException(
        'You can review only after the session has ended',
      );
    }

    // 4. Tutor must match booking availability owner
    const availability = await this.availabilityModel.findById(
      slot.tutorAvailability,
      { user: 1 },
    );

    if (!availability || !availability.user.equals(tutorId)) {
      throw new BadRequestException('Tutor does not match booking');
    }

    // 5. Prevent duplicate review
    const alreadyReviewed = await this.reviewModel.exists({
      booking: bookingId,
      student: studentId,
    });

    if (alreadyReviewed) {
      throw new BadRequestException('You have already reviewed this booking');
    }

    // 6. Create review
    return this.reviewModel.create({
      booking: bookingId,
      student: studentId,
      tutor: tutorId,
      rating: dto.rating,
      comment: dto.comment,
    });
  }
}
