// Generated from src/grammar/Document.g4 by ANTLR 4.8
// jshint ignore: start
var antlr4 = require('antlr4/index');



var serializedATN = ["\u0003\u608b\ua72a\u8133\ub9ed\u417c\u3be7\u7786\u5964",
    "\u0002(\u0156\b\u0001\u0004\u0002\t\u0002\u0004\u0003\t\u0003\u0004",
    "\u0004\t\u0004\u0004\u0005\t\u0005\u0004\u0006\t\u0006\u0004\u0007\t",
    "\u0007\u0004\b\t\b\u0004\t\t\t\u0004\n\t\n\u0004\u000b\t\u000b\u0004",
    "\f\t\f\u0004\r\t\r\u0004\u000e\t\u000e\u0004\u000f\t\u000f\u0004\u0010",
    "\t\u0010\u0004\u0011\t\u0011\u0004\u0012\t\u0012\u0004\u0013\t\u0013",
    "\u0004\u0014\t\u0014\u0004\u0015\t\u0015\u0004\u0016\t\u0016\u0004\u0017",
    "\t\u0017\u0004\u0018\t\u0018\u0004\u0019\t\u0019\u0004\u001a\t\u001a",
    "\u0004\u001b\t\u001b\u0004\u001c\t\u001c\u0004\u001d\t\u001d\u0004\u001e",
    "\t\u001e\u0004\u001f\t\u001f\u0004 \t \u0004!\t!\u0004\"\t\"\u0004#",
    "\t#\u0004$\t$\u0004%\t%\u0004&\t&\u0004\'\t\'\u0004(\t(\u0004)\t)\u0003",
    "\u0002\u0003\u0002\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003",
    "\u0003\u0003\u0004\u0003\u0004\u0003\u0004\u0003\u0004\u0003\u0004\u0003",
    "\u0005\u0003\u0005\u0003\u0005\u0003\u0006\u0003\u0006\u0003\u0006\u0003",
    "\u0006\u0003\u0006\u0003\u0007\u0003\u0007\u0003\u0007\u0003\u0007\u0003",
    "\u0007\u0003\u0007\u0003\u0007\u0003\u0007\u0003\u0007\u0003\u0007\u0003",
    "\u0007\u0003\u0007\u0003\b\u0003\b\u0003\b\u0003\t\u0003\t\u0003\t\u0003",
    "\t\u0003\t\u0003\n\u0003\n\u0003\n\u0003\n\u0003\n\u0003\u000b\u0003",
    "\u000b\u0003\u000b\u0003\u000b\u0003\u000b\u0003\u000b\u0003\f\u0003",
    "\f\u0003\f\u0003\f\u0003\f\u0003\r\u0003\r\u0003\r\u0003\r\u0003\r\u0003",
    "\r\u0003\r\u0003\r\u0003\u000e\u0003\u000e\u0003\u000e\u0003\u000e\u0003",
    "\u000e\u0003\u000e\u0003\u000e\u0003\u000e\u0003\u000f\u0003\u000f\u0003",
    "\u000f\u0003\u000f\u0003\u000f\u0003\u000f\u0003\u000f\u0003\u000f\u0003",
    "\u000f\u0003\u0010\u0003\u0010\u0003\u0010\u0003\u0010\u0003\u0010\u0003",
    "\u0010\u0003\u0010\u0003\u0010\u0003\u0010\u0003\u0011\u0003\u0011\u0003",
    "\u0011\u0003\u0011\u0003\u0011\u0003\u0012\u0003\u0012\u0003\u0012\u0003",
    "\u0012\u0003\u0012\u0003\u0012\u0003\u0012\u0003\u0012\u0003\u0012\u0003",
    "\u0012\u0003\u0013\u0003\u0013\u0003\u0013\u0003\u0013\u0003\u0013\u0003",
    "\u0013\u0003\u0013\u0003\u0014\u0003\u0014\u0003\u0014\u0003\u0014\u0003",
    "\u0014\u0003\u0014\u0003\u0014\u0003\u0014\u0003\u0014\u0003\u0014\u0003",
    "\u0015\u0003\u0015\u0003\u0015\u0003\u0015\u0003\u0015\u0003\u0016\u0003",
    "\u0016\u0003\u0016\u0003\u0016\u0003\u0016\u0003\u0016\u0003\u0016\u0003",
    "\u0016\u0003\u0016\u0003\u0017\u0003\u0017\u0003\u0017\u0003\u0017\u0003",
    "\u0017\u0003\u0017\u0003\u0017\u0003\u0017\u0003\u0017\u0003\u0018\u0003",
    "\u0018\u0003\u0018\u0003\u0018\u0003\u0018\u0003\u0018\u0003\u0018\u0003",
    "\u0018\u0003\u0018\u0003\u0019\u0003\u0019\u0003\u0019\u0003\u0019\u0003",
    "\u0019\u0003\u0019\u0003\u0019\u0003\u0019\u0003\u001a\u0003\u001a\u0003",
    "\u001a\u0003\u001a\u0003\u001a\u0003\u001b\u0003\u001b\u0003\u001b\u0003",
    "\u001b\u0003\u001b\u0003\u001c\u0003\u001c\u0003\u001c\u0003\u001c\u0003",
    "\u001c\u0003\u001d\u0003\u001d\u0003\u001d\u0003\u001d\u0003\u001d\u0003",
    "\u001e\u0003\u001e\u0003\u001f\u0003\u001f\u0003\u001f\u0003\u001f\u0003",
    "\u001f\u0003\u001f\u0003\u001f\u0003\u001f\u0003\u001f\u0003\u001f\u0003",
    " \u0003 \u0003 \u0003 \u0003 \u0003!\u0003!\u0003!\u0006!\u011e\n!\r",
    "!\u000e!\u011f\u0003!\u0003!\u0003\"\u0003\"\u0007\"\u0126\n\"\f\"\u000e",
    "\"\u0129\u000b\"\u0003#\u0003#\u0003#\u0003#\u0007#\u012f\n#\f#\u000e",
    "#\u0132\u000b#\u0003#\u0003#\u0003$\u0003$\u0003$\u0003$\u0005$\u013a",
    "\n$\u0003%\u0005%\u013d\n%\u0003%\u0003%\u0003&\u0003&\u0003&\u0003",
    "&\u0003\'\u0003\'\u0003\'\u0003\'\u0007\'\u0149\n\'\f\'\u000e\'\u014c",
    "\u000b\'\u0003(\u0003(\u0007(\u0150\n(\f(\u000e(\u0153\u000b(\u0003",
    ")\u0003)\u0003\u0130\u0002*\u0003\u0003\u0005\u0004\u0007\u0005\t\u0006",
    "\u000b\u0007\r\b\u000f\t\u0011\n\u0013\u000b\u0015\f\u0017\r\u0019\u000e",
    "\u001b\u000f\u001d\u0010\u001f\u0011!\u0012#\u0013%\u0014\'\u0015)\u0016",
    "+\u0017-\u0018/\u00191\u001a3\u001b5\u001c7\u001d9\u001e;\u001f= ?!",
    "A\"C#E$G%I&K\'M(O\u0002Q\u0002\u0003\u0002\u0006\u0004\u0002\u000b\u000f",
    "\"\"\u0004\u0002\f\f\u000f\u000f\u0004\u0002C\\c|\u0005\u00022;C\\c",
    "|\u0002\u015b\u0002\u0003\u0003\u0002\u0002\u0002\u0002\u0005\u0003",
    "\u0002\u0002\u0002\u0002\u0007\u0003\u0002\u0002\u0002\u0002\t\u0003",
    "\u0002\u0002\u0002\u0002\u000b\u0003\u0002\u0002\u0002\u0002\r\u0003",
    "\u0002\u0002\u0002\u0002\u000f\u0003\u0002\u0002\u0002\u0002\u0011\u0003",
    "\u0002\u0002\u0002\u0002\u0013\u0003\u0002\u0002\u0002\u0002\u0015\u0003",
    "\u0002\u0002\u0002\u0002\u0017\u0003\u0002\u0002\u0002\u0002\u0019\u0003",
    "\u0002\u0002\u0002\u0002\u001b\u0003\u0002\u0002\u0002\u0002\u001d\u0003",
    "\u0002\u0002\u0002\u0002\u001f\u0003\u0002\u0002\u0002\u0002!\u0003",
    "\u0002\u0002\u0002\u0002#\u0003\u0002\u0002\u0002\u0002%\u0003\u0002",
    "\u0002\u0002\u0002\'\u0003\u0002\u0002\u0002\u0002)\u0003\u0002\u0002",
    "\u0002\u0002+\u0003\u0002\u0002\u0002\u0002-\u0003\u0002\u0002\u0002",
    "\u0002/\u0003\u0002\u0002\u0002\u00021\u0003\u0002\u0002\u0002\u0002",
    "3\u0003\u0002\u0002\u0002\u00025\u0003\u0002\u0002\u0002\u00027\u0003",
    "\u0002\u0002\u0002\u00029\u0003\u0002\u0002\u0002\u0002;\u0003\u0002",
    "\u0002\u0002\u0002=\u0003\u0002\u0002\u0002\u0002?\u0003\u0002\u0002",
    "\u0002\u0002A\u0003\u0002\u0002\u0002\u0002C\u0003\u0002\u0002\u0002",
    "\u0002E\u0003\u0002\u0002\u0002\u0002G\u0003\u0002\u0002\u0002\u0002",
    "I\u0003\u0002\u0002\u0002\u0002K\u0003\u0002\u0002\u0002\u0002M\u0003",
    "\u0002\u0002\u0002\u0003S\u0003\u0002\u0002\u0002\u0005U\u0003\u0002",
    "\u0002\u0002\u0007Z\u0003\u0002\u0002\u0002\t_\u0003\u0002\u0002\u0002",
    "\u000bb\u0003\u0002\u0002\u0002\rg\u0003\u0002\u0002\u0002\u000fs\u0003",
    "\u0002\u0002\u0002\u0011v\u0003\u0002\u0002\u0002\u0013{\u0003\u0002",
    "\u0002\u0002\u0015\u0080\u0003\u0002\u0002\u0002\u0017\u0086\u0003\u0002",
    "\u0002\u0002\u0019\u008b\u0003\u0002\u0002\u0002\u001b\u0093\u0003\u0002",
    "\u0002\u0002\u001d\u009b\u0003\u0002\u0002\u0002\u001f\u00a4\u0003\u0002",
    "\u0002\u0002!\u00ad\u0003\u0002\u0002\u0002#\u00b2\u0003\u0002\u0002",
    "\u0002%\u00bc\u0003\u0002\u0002\u0002\'\u00c3\u0003\u0002\u0002\u0002",
    ")\u00cd\u0003\u0002\u0002\u0002+\u00d2\u0003\u0002\u0002\u0002-\u00db",
    "\u0003\u0002\u0002\u0002/\u00e4\u0003\u0002\u0002\u00021\u00ed\u0003",
    "\u0002\u0002\u00023\u00f5\u0003\u0002\u0002\u00025\u00fa\u0003\u0002",
    "\u0002\u00027\u00ff\u0003\u0002\u0002\u00029\u0104\u0003\u0002\u0002",
    "\u0002;\u0109\u0003\u0002\u0002\u0002=\u010b\u0003\u0002\u0002\u0002",
    "?\u0115\u0003\u0002\u0002\u0002A\u011d\u0003\u0002\u0002\u0002C\u0123",
    "\u0003\u0002\u0002\u0002E\u012a\u0003\u0002\u0002\u0002G\u0135\u0003",
    "\u0002\u0002\u0002I\u013c\u0003\u0002\u0002\u0002K\u0140\u0003\u0002",
    "\u0002\u0002M\u0144\u0003\u0002\u0002\u0002O\u014d\u0003\u0002\u0002",
    "\u0002Q\u0154\u0003\u0002\u0002\u0002ST\u0007<\u0002\u0002T\u0004\u0003",
    "\u0002\u0002\u0002UV\u0007P\u0002\u0002VW\u0007Q\u0002\u0002WX\u0007",
    "V\u0002\u0002XY\u0007G\u0002\u0002Y\u0006\u0003\u0002\u0002\u0002Z[",
    "\u0007L\u0002\u0002[\\\u0007W\u0002\u0002\\]\u0007O\u0002\u0002]^\u0007",
    "R\u0002\u0002^\b\u0003\u0002\u0002\u0002_`\u0007V\u0002\u0002`a\u0007",
    "Q\u0002\u0002a\n\u0003\u0002\u0002\u0002bc\u0007P\u0002\u0002cd\u0007",
    "G\u0002\u0002de\u0007Z\u0002\u0002ef\u0007V\u0002\u0002f\f\u0003\u0002",
    "\u0002\u0002gh\u0007K\u0002\u0002hi\u0007P\u0002\u0002ij\u0007U\u0002",
    "\u0002jk\u0007V\u0002\u0002kl\u0007T\u0002\u0002lm\u0007W\u0002\u0002",
    "mn\u0007E\u0002\u0002no\u0007V\u0002\u0002op\u0007K\u0002\u0002pq\u0007",
    "Q\u0002\u0002qr\u0007P\u0002\u0002r\u000e\u0003\u0002\u0002\u0002st",
    "\u0007Q\u0002\u0002tu\u0007P\u0002\u0002u\u0010\u0003\u0002\u0002\u0002",
    "vw\u0007P\u0002\u0002wx\u0007Q\u0002\u0002xy\u0007P\u0002\u0002yz\u0007",
    "G\u0002\u0002z\u0012\u0003\u0002\u0002\u0002{|\u0007V\u0002\u0002|}",
    "\u0007T\u0002\u0002}~\u0007W\u0002\u0002~\u007f\u0007G\u0002\u0002\u007f",
    "\u0014\u0003\u0002\u0002\u0002\u0080\u0081\u0007H\u0002\u0002\u0081",
    "\u0082\u0007C\u0002\u0002\u0082\u0083\u0007N\u0002\u0002\u0083\u0084",
    "\u0007U\u0002\u0002\u0084\u0085\u0007G\u0002\u0002\u0085\u0016\u0003",
    "\u0002\u0002\u0002\u0086\u0087\u0007R\u0002\u0002\u0087\u0088\u0007",
    "W\u0002\u0002\u0088\u0089\u0007U\u0002\u0002\u0089\u008a\u0007J\u0002",
    "\u0002\u008a\u0018\u0003\u0002\u0002\u0002\u008b\u008c\u0007J\u0002",
    "\u0002\u008c\u008d\u0007C\u0002\u0002\u008d\u008e\u0007P\u0002\u0002",
    "\u008e\u008f\u0007F\u0002\u0002\u008f\u0090\u0007N\u0002\u0002\u0090",
    "\u0091\u0007G\u0002\u0002\u0091\u0092\u0007T\u0002\u0002\u0092\u001a",
    "\u0003\u0002\u0002\u0002\u0093\u0094\u0007N\u0002\u0002\u0094\u0095",
    "\u0007K\u0002\u0002\u0095\u0096\u0007V\u0002\u0002\u0096\u0097\u0007",
    "G\u0002\u0002\u0097\u0098\u0007T\u0002\u0002\u0098\u0099\u0007C\u0002",
    "\u0002\u0099\u009a\u0007N\u0002\u0002\u009a\u001c\u0003\u0002\u0002",
    "\u0002\u009b\u009c\u0007E\u0002\u0002\u009c\u009d\u0007Q\u0002\u0002",
    "\u009d\u009e\u0007P\u0002\u0002\u009e\u009f\u0007U\u0002\u0002\u009f",
    "\u00a0\u0007V\u0002\u0002\u00a0\u00a1\u0007C\u0002\u0002\u00a1\u00a2",
    "\u0007P\u0002\u0002\u00a2\u00a3\u0007V\u0002\u0002\u00a3\u001e\u0003",
    "\u0002\u0002\u0002\u00a4\u00a5\u0007C\u0002\u0002\u00a5\u00a6\u0007",
    "T\u0002\u0002\u00a6\u00a7\u0007I\u0002\u0002\u00a7\u00a8\u0007W\u0002",
    "\u0002\u00a8\u00a9\u0007O\u0002\u0002\u00a9\u00aa\u0007G\u0002\u0002",
    "\u00aa\u00ab\u0007P\u0002\u0002\u00ab\u00ac\u0007V\u0002\u0002\u00ac",
    " \u0003\u0002\u0002\u0002\u00ad\u00ae\u0007R\u0002\u0002\u00ae\u00af",
    "\u0007W\u0002\u0002\u00af\u00b0\u0007N\u0002\u0002\u00b0\u00b1\u0007",
    "N\u0002\u0002\u00b1\"\u0003\u0002\u0002\u0002\u00b2\u00b3\u0007E\u0002",
    "\u0002\u00b3\u00b4\u0007Q\u0002\u0002\u00b4\u00b5\u0007O\u0002\u0002",
    "\u00b5\u00b6\u0007R\u0002\u0002\u00b6\u00b7\u0007Q\u0002\u0002\u00b7",
    "\u00b8\u0007P\u0002\u0002\u00b8\u00b9\u0007G\u0002\u0002\u00b9\u00ba",
    "\u0007P\u0002\u0002\u00ba\u00bb\u0007V\u0002\u0002\u00bb$\u0003\u0002",
    "\u0002\u0002\u00bc\u00bd\u0007T\u0002\u0002\u00bd\u00be\u0007G\u0002",
    "\u0002\u00be\u00bf\u0007U\u0002\u0002\u00bf\u00c0\u0007W\u0002\u0002",
    "\u00c0\u00c1\u0007N\u0002\u0002\u00c1\u00c2\u0007V\u0002\u0002\u00c2",
    "&\u0003\u0002\u0002\u0002\u00c3\u00c4\u0007G\u0002\u0002\u00c4\u00c5",
    "\u0007Z\u0002\u0002\u00c5\u00c6\u0007E\u0002\u0002\u00c6\u00c7\u0007",
    "G\u0002\u0002\u00c7\u00c8\u0007R\u0002\u0002\u00c8\u00c9\u0007V\u0002",
    "\u0002\u00c9\u00ca\u0007K\u0002\u0002\u00ca\u00cb\u0007Q\u0002\u0002",
    "\u00cb\u00cc\u0007P\u0002\u0002\u00cc(\u0003\u0002\u0002\u0002\u00cd",
    "\u00ce\u0007N\u0002\u0002\u00ce\u00cf\u0007Q\u0002\u0002\u00cf\u00d0",
    "\u0007C\u0002\u0002\u00d0\u00d1\u0007F\u0002\u0002\u00d1*\u0003\u0002",
    "\u0002\u0002\u00d2\u00d3\u0007T\u0002\u0002\u00d3\u00d4\u0007G\u0002",
    "\u0002\u00d4\u00d5\u0007I\u0002\u0002\u00d5\u00d6\u0007K\u0002\u0002",
    "\u00d6\u00d7\u0007U\u0002\u0002\u00d7\u00d8\u0007V\u0002\u0002\u00d8",
    "\u00d9\u0007G\u0002\u0002\u00d9\u00da\u0007T\u0002\u0002\u00da,\u0003",
    "\u0002\u0002\u0002\u00db\u00dc\u0007F\u0002\u0002\u00dc\u00dd\u0007",
    "Q\u0002\u0002\u00dd\u00de\u0007E\u0002\u0002\u00de\u00df\u0007W\u0002",
    "\u0002\u00df\u00e0\u0007O\u0002\u0002\u00e0\u00e1\u0007G\u0002\u0002",
    "\u00e1\u00e2\u0007P\u0002\u0002\u00e2\u00e3\u0007V\u0002\u0002\u00e3",
    ".\u0003\u0002\u0002\u0002\u00e4\u00e5\u0007E\u0002\u0002\u00e5\u00e6",
    "\u0007Q\u0002\u0002\u00e6\u00e7\u0007P\u0002\u0002\u00e7\u00e8\u0007",
    "V\u0002\u0002\u00e8\u00e9\u0007T\u0002\u0002\u00e9\u00ea\u0007C\u0002",
    "\u0002\u00ea\u00eb\u0007E\u0002\u0002\u00eb\u00ec\u0007V\u0002\u0002",
    "\u00ec0\u0003\u0002\u0002\u0002\u00ed\u00ee\u0007O\u0002\u0002\u00ee",
    "\u00ef\u0007G\u0002\u0002\u00ef\u00f0\u0007U\u0002\u0002\u00f0\u00f1",
    "\u0007U\u0002\u0002\u00f1\u00f2\u0007C\u0002\u0002\u00f2\u00f3\u0007",
    "I\u0002\u0002\u00f3\u00f4\u0007G\u0002\u0002\u00f42\u0003\u0002\u0002",
    "\u0002\u00f5\u00f6\u0007U\u0002\u0002\u00f6\u00f7\u0007C\u0002\u0002",
    "\u00f7\u00f8\u0007X\u0002\u0002\u00f8\u00f9\u0007G\u0002\u0002\u00f9",
    "4\u0003\u0002\u0002\u0002\u00fa\u00fb\u0007F\u0002\u0002\u00fb\u00fc",
    "\u0007T\u0002\u0002\u00fc\u00fd\u0007Q\u0002\u0002\u00fd\u00fe\u0007",
    "R\u0002\u0002\u00fe6\u0003\u0002\u0002\u0002\u00ff\u0100\u0007E\u0002",
    "\u0002\u0100\u0101\u0007C\u0002\u0002\u0101\u0102\u0007N\u0002\u0002",
    "\u0102\u0103\u0007N\u0002\u0002\u01038\u0003\u0002\u0002\u0002\u0104",
    "\u0105\u0007Y\u0002\u0002\u0105\u0106\u0007K\u0002\u0002\u0106\u0107",
    "\u0007V\u0002\u0002\u0107\u0108\u0007J\u0002\u0002\u0108:\u0003\u0002",
    "\u0002\u0002\u0109\u010a\u00073\u0002\u0002\u010a<\u0003\u0002\u0002",
    "\u0002\u010b\u010c\u0007C\u0002\u0002\u010c\u010d\u0007T\u0002\u0002",
    "\u010d\u010e\u0007I\u0002\u0002\u010e\u010f\u0007W\u0002\u0002\u010f",
    "\u0110\u0007O\u0002\u0002\u0110\u0111\u0007G\u0002\u0002\u0111\u0112",
    "\u0007P\u0002\u0002\u0112\u0113\u0007V\u0002\u0002\u0113\u0114\u0007",
    "U\u0002\u0002\u0114>\u0003\u0002\u0002\u0002\u0115\u0116\u0007U\u0002",
    "\u0002\u0116\u0117\u0007G\u0002\u0002\u0117\u0118\u0007P\u0002\u0002",
    "\u0118\u0119\u0007F\u0002\u0002\u0119@\u0003\u0002\u0002\u0002\u011a",
    "\u011b\u0005C\"\u0002\u011b\u011c\u00070\u0002\u0002\u011c\u011e\u0003",
    "\u0002\u0002\u0002\u011d\u011a\u0003\u0002\u0002\u0002\u011e\u011f\u0003",
    "\u0002\u0002\u0002\u011f\u011d\u0003\u0002\u0002\u0002\u011f\u0120\u0003",
    "\u0002\u0002\u0002\u0120\u0121\u0003\u0002\u0002\u0002\u0121\u0122\u0005",
    "O(\u0002\u0122B\u0003\u0002\u0002\u0002\u0123\u0127\u00043;\u0002\u0124",
    "\u0126\u00042;\u0002\u0125\u0124\u0003\u0002\u0002\u0002\u0126\u0129",
    "\u0003\u0002\u0002\u0002\u0127\u0125\u0003\u0002\u0002\u0002\u0127\u0128",
    "\u0003\u0002\u0002\u0002\u0128D\u0003\u0002\u0002\u0002\u0129\u0127",
    "\u0003\u0002\u0002\u0002\u012a\u0130\u0007b\u0002\u0002\u012b\u012c",
    "\u0007^\u0002\u0002\u012c\u012f\u0007b\u0002\u0002\u012d\u012f\u0005",
    "Q)\u0002\u012e\u012b\u0003\u0002\u0002\u0002\u012e\u012d\u0003\u0002",
    "\u0002\u0002\u012f\u0132\u0003\u0002\u0002\u0002\u0130\u0131\u0003\u0002",
    "\u0002\u0002\u0130\u012e\u0003\u0002\u0002\u0002\u0131\u0133\u0003\u0002",
    "\u0002\u0002\u0132\u0130\u0003\u0002\u0002\u0002\u0133\u0134\u0007b",
    "\u0002\u0002\u0134F\u0003\u0002\u0002\u0002\u0135\u0136\u0007&\u0002",
    "\u0002\u0136\u0139\u0005O(\u0002\u0137\u0138\u0007/\u0002\u0002\u0138",
    "\u013a\u0005C\"\u0002\u0139\u0137\u0003\u0002\u0002\u0002\u0139\u013a",
    "\u0003\u0002\u0002\u0002\u013aH\u0003\u0002\u0002\u0002\u013b\u013d",
    "\u0007\u000f\u0002\u0002\u013c\u013b\u0003\u0002\u0002\u0002\u013c\u013d",
    "\u0003\u0002\u0002\u0002\u013d\u013e\u0003\u0002\u0002\u0002\u013e\u013f",
    "\u0007\f\u0002\u0002\u013fJ\u0003\u0002\u0002\u0002\u0140\u0141\t\u0002",
    "\u0002\u0002\u0141\u0142\u0003\u0002\u0002\u0002\u0142\u0143\b&\u0002",
    "\u0002\u0143L\u0003\u0002\u0002\u0002\u0144\u0145\u0007/\u0002\u0002",
    "\u0145\u0146\u0007/\u0002\u0002\u0146\u014a\u0003\u0002\u0002\u0002",
    "\u0147\u0149\n\u0003\u0002\u0002\u0148\u0147\u0003\u0002\u0002\u0002",
    "\u0149\u014c\u0003\u0002\u0002\u0002\u014a\u0148\u0003\u0002\u0002\u0002",
    "\u014a\u014b\u0003\u0002\u0002\u0002\u014bN\u0003\u0002\u0002\u0002",
    "\u014c\u014a\u0003\u0002\u0002\u0002\u014d\u0151\t\u0004\u0002\u0002",
    "\u014e\u0150\t\u0005\u0002\u0002\u014f\u014e\u0003\u0002\u0002\u0002",
    "\u0150\u0153\u0003\u0002\u0002\u0002\u0151\u014f\u0003\u0002\u0002\u0002",
    "\u0151\u0152\u0003\u0002\u0002\u0002\u0152P\u0003\u0002\u0002\u0002",
    "\u0153\u0151\u0003\u0002\u0002\u0002\u0154\u0155\u000b\u0002\u0002\u0002",
    "\u0155R\u0003\u0002\u0002\u0002\u000b\u0002\u011f\u0127\u012e\u0130",
    "\u0139\u013c\u014a\u0151\u0003\u0002\u0003\u0002"].join("");


var atn = new antlr4.atn.ATNDeserializer().deserialize(serializedATN);

var decisionsToDFA = atn.decisionToState.map( function(ds, index) { return new antlr4.dfa.DFA(ds, index); });

function DocumentLexer(input) {
	antlr4.Lexer.call(this, input);
    this._interp = new antlr4.atn.LexerATNSimulator(this, atn, decisionsToDFA, new antlr4.PredictionContextCache());
    return this;
}

DocumentLexer.prototype = Object.create(antlr4.Lexer.prototype);
DocumentLexer.prototype.constructor = DocumentLexer;

Object.defineProperty(DocumentLexer.prototype, "atn", {
        get : function() {
                return atn;
        }
});

DocumentLexer.EOF = antlr4.Token.EOF;
DocumentLexer.T__0 = 1;
DocumentLexer.T__1 = 2;
DocumentLexer.T__2 = 3;
DocumentLexer.T__3 = 4;
DocumentLexer.T__4 = 5;
DocumentLexer.T__5 = 6;
DocumentLexer.T__6 = 7;
DocumentLexer.T__7 = 8;
DocumentLexer.T__8 = 9;
DocumentLexer.T__9 = 10;
DocumentLexer.T__10 = 11;
DocumentLexer.T__11 = 12;
DocumentLexer.T__12 = 13;
DocumentLexer.T__13 = 14;
DocumentLexer.T__14 = 15;
DocumentLexer.T__15 = 16;
DocumentLexer.T__16 = 17;
DocumentLexer.T__17 = 18;
DocumentLexer.T__18 = 19;
DocumentLexer.T__19 = 20;
DocumentLexer.T__20 = 21;
DocumentLexer.T__21 = 22;
DocumentLexer.T__22 = 23;
DocumentLexer.T__23 = 24;
DocumentLexer.T__24 = 25;
DocumentLexer.T__25 = 26;
DocumentLexer.T__26 = 27;
DocumentLexer.T__27 = 28;
DocumentLexer.T__28 = 29;
DocumentLexer.T__29 = 30;
DocumentLexer.T__30 = 31;
DocumentLexer.LABEL = 32;
DocumentLexer.NUMBER = 33;
DocumentLexer.LITERAL = 34;
DocumentLexer.SYMBOL = 35;
DocumentLexer.EOL = 36;
DocumentLexer.SPACE = 37;
DocumentLexer.COMMENT = 38;

DocumentLexer.prototype.channelNames = [ "DEFAULT_TOKEN_CHANNEL", "HIDDEN" ];

DocumentLexer.prototype.modeNames = [ "DEFAULT_MODE" ];

DocumentLexer.prototype.literalNames = [ null, "':'", "'NOTE'", "'JUMP'", 
                                         "'TO'", "'NEXT'", "'INSTRUCTION'", 
                                         "'ON'", "'NONE'", "'TRUE'", "'FALSE'", 
                                         "'PUSH'", "'HANDLER'", "'LITERAL'", 
                                         "'CONSTANT'", "'ARGUMENT'", "'PULL'", 
                                         "'COMPONENT'", "'RESULT'", "'EXCEPTION'", 
                                         "'LOAD'", "'REGISTER'", "'DOCUMENT'", 
                                         "'CONTRACT'", "'MESSAGE'", "'SAVE'", 
                                         "'DROP'", "'CALL'", "'WITH'", "'1'", 
                                         "'ARGUMENTS'", "'SEND'" ];

DocumentLexer.prototype.symbolicNames = [ null, null, null, null, null, 
                                          null, null, null, null, null, 
                                          null, null, null, null, null, 
                                          null, null, null, null, null, 
                                          null, null, null, null, null, 
                                          null, null, null, null, null, 
                                          null, null, "LABEL", "NUMBER", 
                                          "LITERAL", "SYMBOL", "EOL", "SPACE", 
                                          "COMMENT" ];

DocumentLexer.prototype.ruleNames = [ "T__0", "T__1", "T__2", "T__3", "T__4", 
                                      "T__5", "T__6", "T__7", "T__8", "T__9", 
                                      "T__10", "T__11", "T__12", "T__13", 
                                      "T__14", "T__15", "T__16", "T__17", 
                                      "T__18", "T__19", "T__20", "T__21", 
                                      "T__22", "T__23", "T__24", "T__25", 
                                      "T__26", "T__27", "T__28", "T__29", 
                                      "T__30", "LABEL", "NUMBER", "LITERAL", 
                                      "SYMBOL", "EOL", "SPACE", "COMMENT", 
                                      "IDENTIFIER", "CHARACTER" ];

DocumentLexer.prototype.grammarFileName = "Document.g4";


exports.DocumentLexer = DocumentLexer;

