import httpStatus from 'http-status';

import QueryBuilder from '../../builder/query.builder';
import ApiError from '../../errors/ApiError';
import Offer from './offer.model';

import { IOffer } from './offer.interface';
import { offerSearchableFields } from './offer.constant';

class OfferServiceClass {
  #OfferModel;
  #QueryBuilder: typeof QueryBuilder;
  constructor() {
    this.#OfferModel = Offer;
    this.#QueryBuilder = QueryBuilder;
  }
  // create Offer service
  readonly createOffer = async (payload: IOffer) => {
    // check already Offer exit, if not, throw error
    const isExitOffer = await this.#OfferModel.findOne({ name: payload?.name });

    // check already Offer exit, throw error
    if (isExitOffer) {
      throw new ApiError(httpStatus.CONFLICT, 'Offer already Exit!');
    }

    let result = null;

    // checking date and compare
    if (payload.startDate && payload.endDate) {
      if (new Date(payload.startDate) >= new Date(payload.endDate)) {
        throw new ApiError(
          httpStatus.BAD_REQUEST,
          'Offer Date should be greater than start date!'
        );
      }

      result = await this.#OfferModel.create(payload);
    }
    return result;
  };

  // get all Offers service
  readonly allOffers = async (query: Record<string, unknown>) => {
    const userQuery = new this.#QueryBuilder(this.#OfferModel.find(), query)
      .search(offerSearchableFields)
      .filter()
      .sort()
      .paginate()
      .fields();

    // result of user
    const result = await userQuery.modelQuery;

    // get meta user
    const meta = await userQuery.countTotal();

    return {
      meta,
      result,
    };
  };

  // get single Offer service
  readonly getSingleOffer = async (payload: string) => {
    const result = await this.#OfferModel.findById(payload).exec();
    return result;
  };

  // update Offer service
  readonly updateOffer = async (
    id: string,
    payload: Partial<IOffer>
  )=> {
    // check already Offer exit, if not throw error
    const isExitOffer = await this.#OfferModel.findById({ _id: id });
    if (!isExitOffer) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Offer Not Found!');
    }

    const { startDate, endDate }: Partial<IOffer> = payload;

    // if you want to update start date
    if (startDate && !endDate) {
      if (new Date(startDate) >= new Date(isExitOffer.endDate)) {
        throw new ApiError(
          httpStatus.BAD_REQUEST,
          'Offer Date should be greater than start date!'
        );
      }
    }

    // if you want to update end date
    if (endDate && !startDate) {
      if (new Date(isExitOffer.startDate) >= new Date(endDate)) {
        throw new ApiError(
          httpStatus.BAD_REQUEST,
          'Offer Date should be greater than start date!'
        );
      }
    }

    // if you want to update both date
    if (endDate && startDate) {
      if (new Date(startDate) >= new Date(endDate)) {
        throw new ApiError(
          httpStatus.BAD_REQUEST,
          'Offer Date should be greater than start date!'
        );
      }
    }

    // update the Offer
    let result = null;

    if (Object.keys(payload).length) {
      result = await this.#OfferModel.findOneAndUpdate({ _id: id }, payload, {
        new: true,
      });
    }

    return result;
  };

  // delete Offer service
  readonly deleteOffer = async (payload: string) => {
    // check already Offer exit, if not throw error
    const isExitOffer = await this.#OfferModel.findById({ _id: payload });
    if (!isExitOffer) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Offer Not Found!');
    }

    // delete the Offer
    const result = await this.#OfferModel.findByIdAndDelete(payload);
    return result;
  };
}

export const OfferService = new OfferServiceClass();
