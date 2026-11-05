import test from 'node:test';
import assert from 'node:assert/strict';
import {gymLessons} from '../data/gymLessons';
import {lessonQuizzes, passedQuiz} from '../data/lessonQuizzes';
test('every lesson has its own two-question checkpoint and valid answer key',()=>{
  assert.deepEqual(Object.keys(lessonQuizzes).sort(),gymLessons.map(l=>l.id).sort());
  for(const {id} of gymLessons){
    const quiz=lessonQuizzes[id]!;
    assert.equal(quiz.questions.length,2);
    for(const q of quiz.questions){assert.equal(new Set(q.options).size,3);assert.ok(q.options[q.answer]);assert.ok(q.why);}
    assert.ok(passedQuiz(id,quiz.questions.map(q=>q.answer)));
  }
});
test('blank, partial, incorrect, and unrelated attempts do not pass',()=>{
  for(const {id} of gymLessons){
    const correct=lessonQuizzes[id]!.questions.map(q=>q.answer);
    for(const answers of [[],correct.slice(0,1),[undefined,correct[1]],[(correct[0]+1)%3,correct[1]],correct.concat(0)])assert.equal(passedQuiz(id,answers),false);
  }
  assert.equal(passedQuiz('missing',[]),false);
});
