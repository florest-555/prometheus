// SPDX-License-Identifier: MIT-0
import { createI18nMessages } from '@shared/helpers/i18n.js';

export const DetectorPerformanceMensagens = createI18nMessages({
  // Novas detecções de performance
  consoleInProduction: 'Console.log/info/debug em código pode vazar informações em produção',
  consoleInProductionSugestao: 'Remova console.log em produção ou use biblioteca de logging condicional',

  potentialMemoryLeak: 'Timer ou listener sem cleanup pode causar vazamento de memória',
  potentialMemoryLeakSugestao: 'Certifique-se de remover o listener/timer no unmount do componente',

  inefficientDom: 'Manipulação direta de DOM pode causar reflows/repaints desnecessários',
  inefficientDomSugestao: 'Use fragment ou batch operações DOM para minimizar reflows',

  inefficientArray: 'forEach é mais lento que for loop tradicional',
  inefficientArraySugestao: 'Use for...of ou for loop clássico para melhor performance',

  doubleIteration: 'filter seguido de map faz duas iterações',
  doubleIterationSugestao: 'Use map com condicional ou reduce para uma única iteração',

  inefficientSort: 'Função de sort sem memoization pode ser lenta em grandes listas',
  inefficientSortSugestao: 'Considere usar sort fora do render ou com useMemo'
}, {
  consoleInProduction: 'Console.log/info/debug in code may leak information in production',
  consoleInProductionSugestao: 'Remove console.log in production or use conditional logging library',

  potentialMemoryLeak: 'Timer or listener without cleanup may cause memory leak',
  potentialMemoryLeakSugestao: 'Make sure to remove listener/timer on component unmount',

  inefficientDom: 'Direct DOM manipulation may cause unnecessary reflows/repaints',
  inefficientDomSugestao: 'Use fragment or batch DOM operations to minimize reflows',

  inefficientArray: 'forEach is slower than traditional for loop',
  inefficientArraySugestao: 'Use for...of or classic for loop for better performance',

  doubleIteration: 'filter followed by map makes two iterations',
  doubleIterationSugestao: 'Use map with conditional or reduce for single iteration',

  inefficientSort: 'Sort function without memoization can be slow on large lists',
  inefficientSortSugestao: 'Consider using sort outside render or with useMemo'
});
