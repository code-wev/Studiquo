import { PaginationDto } from 'src/common/dto/pagination.dto';
export declare class CreateReviewDto {
    booking?: string;
    tutor: string;
    rating: number;
    comment: string;
}
export declare class ReviewQueryDto extends PaginationDto {
    rating?: number;
}
