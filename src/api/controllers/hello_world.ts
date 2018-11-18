import express from "express";
import _ from "lodash";
import {
  Body,
  Controller,
  JsonController,
  Delete,
  Get,
  Param,
  Post,
  Put,
  QueryParam
} from "routing-controllers";
import util from "util";
import { logger } from "../../utils";
const router = express.Router();

@JsonController()
export class HelloWorldController {
  @Get("/hello")
  public getHello(@QueryParam("name") name: string): string {
    logger.debug("User's name:", name);
    const response: string = `Hello, ${name || "stranger"}!`;
    return response;
  }
}

export default HelloWorldController;
