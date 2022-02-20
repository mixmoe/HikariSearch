import type * as SauceNAO from 'functions/api/routes/SauceNAO';
import type * as IqDB from 'functions/api/routes/IqDB';
import type * as ascii2d from 'functions/api/routes/ascii2d';
import type * as EHentai from 'functions/api/routes/E-Hentai';
import type * as TraceMoe from 'functions/api/routes/TraceMoe';
import type Schema from 'schemastery';

type RequestSchemaType<T> = T extends Schema<infer S, unknown> ? S : never;

export type SauceNAOParseResult = ReturnType<typeof SauceNAO.parse>;
export type IqDBParseResult = ReturnType<typeof IqDB.parse>;
export type ascii2dParseResult = ReturnType<typeof ascii2d.parse>;
export type EHentaiParseResult = ReturnType<typeof EHentai.parse>;
export type TraceMoeParseResult = ReturnType<typeof TraceMoe.parse>;

export type SauceNAORequestSchema = RequestSchemaType<typeof SauceNAO.schema>;
export type IqDBRequestSchema = RequestSchemaType<typeof IqDB.schema>;
export type ascii2dRequestSchema = RequestSchemaType<typeof ascii2d.schema>;
export type EHentaiRequestSchema = RequestSchemaType<typeof EHentai.schema>;
export type TraceMoeRequestSchema = RequestSchemaType<typeof TraceMoe.schema>;
