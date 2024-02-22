import catchAsync from "../../shared/catchAsync";
import { OrderController } from './../order/order.controller';

class SendEmailControllerClass {
    #SendEmailService: typeof SendEmailService;
  
    constructor(service: typeof SendEmailService) {
      this.#SendEmailService = service;
    }

    readonly const sendEmail = catchAsync( async (req: Request, res: Response) => {
        const data = req.body

        const emailData = {
            ...data,
            message: OrderController()
        }
    })

}