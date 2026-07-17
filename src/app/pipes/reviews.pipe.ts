import {Pipe, PipeTransform} from "@angular/core";

@Pipe({
  name: 'reviews',
  standalone:true
})
export class ReviewsPipe implements PipeTransform{
  transform(reviewsCount?: number): string {
    if(!reviewsCount)
      reviewsCount = 0;

    const cases = [2, 0, 1, 1, 1, 2];
    const titles = ['отзыв', 'отзыва', 'отзывов'];

    const index = reviewsCount % 100 > 4 && reviewsCount % 100 < 20
      ? 2
      : cases[reviewsCount % 10 < 5 ? reviewsCount % 10 : 5];

    return `${reviewsCount} ${titles[index]}`;
  }
}
