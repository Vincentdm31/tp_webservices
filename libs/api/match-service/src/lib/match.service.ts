import { handleDocumentNotFound } from '@rendu-tp0/api/repository/error';
import {
  MatchCreateDto,
  MatchDto,
  MatchResetDto,
  MatchUpdateDto,
} from '@rendu-tp0/common/resource/match';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { MatchDocument, MatchEntity } from './match.entity';
import {
  matchCreateDtoToEntity,
  matchDocumentToDto,
  matchResetDtoToEntity,
  matchUpdateDtoToEntity,
} from './match.mapper';

import { Cron, Timeout } from '@nestjs/schedule';
import axios from 'axios';
import { NodeType, parse } from 'node-html-parser';
import { FilterParams, PaginationParams } from '@rendu-tp0/api/database';

@Injectable()
export class MatchService {
  constructor(
    @InjectModel(MatchEntity.name) private model: Model<MatchDocument>
  ) {}

  create(dto: MatchCreateDto): Promise<MatchDto> {
    const entity = matchCreateDtoToEntity(dto);
    return this.model.create(entity).then(matchDocumentToDto);
  }

  findAll(
    paginationParams: PaginationParams,
    filterParams: FilterParams
  ): Promise<MatchDto[]> {
    return this.model
      .find({
        ...(filterParams.homeTeamName
          ? { homeTeamName: filterParams.homeTeamName }
          : {}),
        ...(filterParams.awayTeamName
          ? { awayTeamName: filterParams.awayTeamName }
          : {}),
        ...(filterParams.team
          ? {
              $or: [
                { awayTeamName: filterParams.team },
                { homeTeamName: filterParams.team },
              ],
            }
          : {}),
        ...(filterParams.date
          ? {
              date: {
                $gte: new Date(filterParams.date),
                $lt: new Date(filterParams.date).setDate(
                  new Date(filterParams.date).getDate() + 1
                ),
              },
            }
          : {}),
      })
      .skip((paginationParams.page - 1) * paginationParams.size)
      .limit(paginationParams.size)
      .exec()
      .then((entities) => entities.map(matchDocumentToDto));
  }

  findOne(id: string): Promise<MatchDto> {
    return this.model
      .findById(id)
      .orFail()
      .exec()
      .then(matchDocumentToDto)
      .catch(handleDocumentNotFound);
  }

  update(dto: MatchUpdateDto): Promise<MatchDto> {
    const entity = matchUpdateDtoToEntity(dto);
    return this.model
      .findByIdAndUpdate(entity.id, entity, { new: true })
      .orFail()
      .exec()
      .then(matchDocumentToDto)
      .catch(handleDocumentNotFound);
  }

  reset(dto: MatchResetDto): Promise<MatchDto> {
    const entity = matchResetDtoToEntity(dto);
    return this.model
      .findByIdAndUpdate(entity.id, entity, { new: true })
      .orFail()
      .exec()
      .then(matchDocumentToDto)
      .catch(handleDocumentNotFound);
  }

  remove(id: string): Promise<void> {
    return this.model
      .deleteOne({ _id: id })
      .orFail()
      .exec()
      .then(() => null)
      .catch(handleDocumentNotFound);
  }

  fetchMatchs(date: string) {
    const months = [
      'janvier',
      'février',
      'mars',
      'avril',
      'mai',
      'juin',
      'juillet',
      'aout',
      'septembre',
      'octobre',
      'novembre',
      'décembre',
    ];

    const url = `https://www.matchendirect.fr/europe/ligue-des-champions-uefa/${date}`;
    return axios
      .get(url)
      .then((r) => r.data)
      .then((html) => parse(html))
      .then((html) => html.querySelector('.table-hover'))
      .then((elements) => Array.from(elements?.childNodes || []))
      .then((elements) => {
        const games = [];
        let date = null;
        for (const element of elements) {
          const e: any = element;
          if (element.nodeType === NodeType.ELEMENT_NODE) {
            if (e.localName === 'thead') {
              date = e.querySelector('tr th')?.innerHTML || date;
              date = date.split(' ');
              date.shift();
              date[1] = String(months.indexOf(date[1])).padStart(2, '0');
              date = date.reverse();
            } else if (e.localName === 'tr') {
              games.push({
                homeTeamName: e.querySelector('.lm3 .lm3_eq1')?.innerText,
                awayTeamName: e.querySelector('.lm3 .lm3_eq2')?.innerText,
                homeTeamScore: Number(
                  e.querySelector('.lm3 .lm3_score')?.innerText.split(' - ')[0]
                ),
                awayTeamScore: Number(
                  e.querySelector('.lm3 .lm3_score')?.innerText.split(' - ')[1]
                ),
                externalId: Number(e.getAttribute('data-matchId')),
                date: new Date(
                  `${date.join(' ')} ${e.querySelector('.lm1')?.innerText}`
                ),
              });
            }
          }
        }
        return games;
      })
      .then((games) => {
        games.forEach((game) => {
          this.insertGame(game);
        });
      })
      .catch((err) => err);
  }

  // @Cron('30 3 * * 1,3,5')
  // @Cron('*/10 * * * * *')
  async getLastDates(date = '', count = 0, total = 10): Promise<any> {
    if (count >= total) {
      return count;
    }

    const url = `https://www.matchendirect.fr/europe/ligue-des-champions-uefa/${date}`;

    return await axios
      .get(url)
      .then((r) => r.data)
      .then((html) => parse(html))
      .then((html) => html.querySelector('a.objselect_prevnext.objselect_prec'))
      .then((el) => {
        const href = el.getAttribute('href');
        const date = href.split('/')[3];
        return date;
      })
      .then((date) => {
        this.fetchMatchs(date).then(() => this.getLastDates(date, count + 1));
      })
      .catch((err) => err);
  }

  insertGame(game) {
    return this.model
      .findOneAndUpdate(
        {
          externalId: game.externalId,
        },
        game,
        { upsert: true, new: true }
      )
      .exec()
      .catch((err) => err);
  }

  async TESTgetLastDates(date = '', count = 0, total = 10): Promise<any> {
    if (count >= total) {
      return count;
    }

    const url = `https://www.matchendirect.fr/europe/ligue-des-champions-uefa/${date}`;

    return await axios
      .get(url)
      .then((r) => r.data)
      .then((html) => parse(html))
      .then((html) => html.querySelector('a.objselect_prevnext.objselect_prec'))
      .then((el) => {
        const href = el.getAttribute('href');
        const date = href.split('/')[3];
        return date;
      })
      .then((e) => e)
      .catch((err) => err);
  }

  TESTfetchMatchs(date: string) {
    const months = [
      'janvier',
      'février',
      'mars',
      'avril',
      'mai',
      'juin',
      'juillet',
      'aout',
      'septembre',
      'octobre',
      'novembre',
      'décembre',
    ];

    const url = `https://www.matchendirect.fr/europe/ligue-des-champions-uefa/${date}`;
    return axios
      .get(url)
      .then((r) => r.data)
      .then((html) => parse(html))
      .then((html) => html.querySelector('.table-hover'))
      .then((elements) => Array.from(elements?.childNodes || []))
      .then((elements) => {
        const games = [];
        let date = null;
        for (const element of elements) {
          const e: any = element;
          if (element.nodeType === NodeType.ELEMENT_NODE) {
            if (e.localName === 'thead') {
              date = e.querySelector('tr th')?.innerHTML || date;
              date = date.split(' ');
              date.shift();
              date[1] = String(months.indexOf(date[1])).padStart(2, '0');
              date = date.reverse();
            } else if (e.localName === 'tr') {
              games.push({
                homeTeamName: e.querySelector('.lm3 .lm3_eq1')?.innerText,
                awayTeamName: e.querySelector('.lm3 .lm3_eq2')?.innerText,
                homeTeamScore: Number(
                  e.querySelector('.lm3 .lm3_score')?.innerText.split(' - ')[0]
                ),
                awayTeamScore: Number(
                  e.querySelector('.lm3 .lm3_score')?.innerText.split(' - ')[1]
                ),
                externalId: Number(e.getAttribute('data-matchId')),
                date: new Date(
                  `${date.join(' ')} ${e.querySelector('.lm1')?.innerText}`
                ),
              });
            }
          }
        }
        return games;
      })
      .catch((err) => err);
  }
}
